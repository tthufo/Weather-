import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, Text } from 'react-native';
import GetLocation from 'react-native-get-location'
import API from '../apis';
import axios, { CancelToken } from 'axios';
import NavigationService from '../../service/navigate';
import _ from 'lodash';
import TopTab from './toptab';
import DeviceInfo from 'react-native-device-info';
import Heading from './header';
import BackGround from './background';

const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const API_KEY = 'AIzaSyBXBWoCCozdvmjRABdP_VfDiPAsSU1WS2Q';

const DEFAULT = { location_id: -1, location_name: 'Hanoi - Vietnam', latitude: 21.028511, longitude: 105.804817, device_id: DeviceInfo.getUniqueId() }

export default class main extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      locationList: [],
      loading: true,
      page: 0,
      currentLocation: {},
      locationName: 'WeatherPlus',
    };

    this.currentPage = 0;
    this.navigation = null;
    this.onReloadData = this.onReloadData.bind(this)
    this.onTabChange = this.onTabChange.bind(this)
    this.backgroundList = []
  }

  params() {
    const { navigation: { state: { params } } } = this.props;
    return params
  }

  componentDidMount() {
    if (this.params().add == true) {

    } else {
      this.getCurrentLocation()
    }
  }

  onReloadData() {
    this.getCurrentLocation()
  }

  onTabChange(route) {
    this.navigation.didChangeTab(route)
  }

  getCurrentLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        this.fetchAddressForLocation(location)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
        this.getLocation()
      })
  }

  async getLocation() {
    const { currentLocation } = this.state;
    this.setState({ loading: true });
    try {
      const weather = await API.home.getWeatherList({
        device_id: DeviceInfo.getUniqueId(),
        weather: null,
      });
      this.setState({ loading: false });
      if (weather.data.status != 200) {
        return
      }
      this.setState({ locationList: [Object.keys(currentLocation).length == 0 ? DEFAULT : currentLocation, ...weather.data.result] }, () => {
        this.setState({ locationName: this.state.locationList[0].location_name })
        this.navigation.didChangeList(this.state.locationList)
      });
    } catch (e) {
      this.setState({ loading: false, isRefreshing: false });
      console.log(e)
    }
  }

  fetchAddressForLocation = location => {
    this.setState({ loading: true });
    let { latitude, longitude } = location;
    this.source = CancelToken.source();
    axios
      .get(`${REVRSE_GEO_CODE_URL}?key=${API_KEY}&latlng=${latitude},${longitude}`, {
        cancelToken: this.source.token,
      })
      .then(({ data }) => {
        this.setState({ loading: false });
        let { results } = data;
        if (results.length > 0) {
          let { formatted_address } = results[0];
          let address = formatted_address.split(',')
          let currentAddress = address.length >= 2 ? `${address[0]} - ${address[1]}` : `${address[0]}`
          if (this._header) {
            this._header.didChangeText(currentAddress)
          }
          this.setState({ currentLocation: { location_id: -1, location_name: currentAddress, latitude, longitude, device_id: DeviceInfo.getUniqueId() } }, () => this.getLocation())
        }
      });
  }

  render() {
    const { locationList } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <BackGround onRef={component => this._background = component} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
          <TouchableOpacity onPress={() => {
            if (this.params().add == true) {
              this.props.navigation.pop();
            } else {
              NavigationService.navigate('LocationListScreen', { onReload: () => this.onReloadData(), onChangeTab: (route) => this.onTabChange(route) });
            }
          }}>
            <Image
              style={{ width: 35, height: 35 }}
              source={this.params().add == true ? require('../../assets/images/back_color.png') : require('../../assets/images/ico_place.png')}
            />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <Heading onRef={component => this._header = component} />
          </View>
          <TouchableOpacity onPress={() => {
            if (this.params().add == true) {
              this.props.navigation.pop();
            } else {
              NavigationService.navigate('SettingScreen', { onReload: () => this.onReloadData() });
            }
          }}>
            <Image
              style={{ width: 35, height: 35 }}
              source={this.params().add == true ? require('../../assets/images/ico_add.png') : require('../../assets/images/ico_setting.png')}
            />
          </TouchableOpacity>
        </View>
        {locationList.length != 0 &&
          <TopTab
            locationList={locationList}
            tabChange={(e) => {
              this._header.didChangeText(locationList[e] && locationList[e].location_name || '')
              this.currentPage = e
              if (this.backgroundList.length >= e) {
                this._background.didChangeImage(this.backgroundList[e])
              }
            }}
            backGroundChange={(bg) => {
              this._background.didChangeImage(bg)
              this.backgroundList[this.currentPage] = bg
            }}
            navi={(navigation) => this.navigation = navigation}
            onRef={(ref) => this.navigation = ref}
          />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    margin: 30,
    width: 200,
    alignSelf: 'center',
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  btn_forgot_password: {
    marginTop: 22,
    height: 44,
  },
  btn_register: {
    margin: 10,
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
  regularText: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 20,
  }
});
