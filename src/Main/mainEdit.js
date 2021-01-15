import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, SafeAreaView, Text } from 'react-native';
import { Container, Content, Button } from 'native-base';
import GetLocation from 'react-native-get-location'
import STG from '../../service/storage';
import API from '../apis';
import HOST from '../apis/host';
import axios, { CancelToken } from 'axios';
import Toast from 'react-native-simple-toast';
import { Header } from '../elements';
import IC from '../elements/icon';
import NavigationService from '../../service/navigate';
import _ from 'lodash';
import TopTab from './toptab';
import MarqueeLabel from 'react-native-lahk-marquee-label';
import DeviceInfo from 'react-native-device-info';
import Heading from './header';
import BackGround from './background';

const REVRSE_GEO_CODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

const API_KEY = 'AIzaSyBXBWoCCozdvmjRABdP_VfDiPAsSU1WS2Q';

const { width, height } = Dimensions.get('window');

const CON = ({ image, title, value }) => {
  return (
    <View style={{ alignItems: 'center', margin: 10 }}>
      <Image
        style={{ width: 45, height: 45, margin: 10 }}
        source={image}
      />
      <Text style={{ fontSize: 35, color: 'white' }}>{value}</Text>
      <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>{title}</Text>
    </View>
  );
};

const BUT = ({ image, title, onPress }) => {
  return (
    <TouchableOpacity style={{ flex: 1, }} onPress={onPress}>
      <View style={{ flex: 1, backgroundColor: '#4B8266', flexDirection: 'row', alignItems: 'center', margin: 10, padding: 10, borderRadius: 8 }}>
        <Image
          style={{ width: 50, height: 50 }}
          source={image}
        />
        <Text style={{ marginLeft: 8, flex: 1, fontSize: 16, color: 'white', flexWrap: 'wrap' }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const COLOR = ["#DFEEB6", "#E9DEB3", "#F1D4B7", "#DCE5CB", "#DFEEB6", "#E9DEB3", "#F1D4B7", "#DCE5CB"]

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
      disable: false,
    };

    this.currentPage = 0;
    this.navigation = null;
    this.backgroundList = []
  }

  params() {
    const { navigation: { state: { params } } } = this.props;
    return params
  }

  componentDidMount() {
    if (this.params().add == true) {
      const { locationName, latitude, longitude } = this.params();
      this.setState({ currentLocation: { location_id: -1, location_name: locationName, latitude, longitude, device_id: DeviceInfo.getUniqueId() } }, () => {
        this.setState({ locationList: [this.state.currentLocation] })
      })
    } else {
      this.getCurrentLocation()
    }
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

  async addLocation() {
    const { navigation: { state: { params: { onReload } } } } = this.props;
    const { currentLocation } = this.state;
    this.setState({ loading: true });
    try {
      const weather = await API.home.addWeather({
        device_id: DeviceInfo.getUniqueId(),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        location_name: currentLocation.location_name,
      });
      this.setState({ loading: false });
      if (weather.data.status != 200) {
        return
      }
      this.props.navigation.pop(2);
      if (onReload) {
        onReload()
      }
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  render() {
    const { locationList, disable } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <BackGround onRef={component => this._background = component} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
          <TouchableOpacity onPress={() => {
            if (this.params().add == true) {
              this.props.navigation.pop();
            } else {
              NavigationService.navigate('LocationListScreen', {});
            }
          }}>
            <Image
              style={{ width: 40, height: 40 }}
              source={this.params().add == true ? require('../../assets/images/arrow_left_white.png') : require('../../assets/images/ico_place.png')}
            />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <Heading onRef={component => this._header = component} />
          </View>
          {disable ? <View style={{ width: 40, height: 40 }} /> :
            <TouchableOpacity onPress={() => {
              if (this.params().add == true) {
                this.addLocation()
              }
            }}>
              <Image
                style={{ width: 40, height: 40 }}
                source={this.params().add == true ? require('../../assets/images/ico_add.png') : require('../../assets/images/ico_setting.png')}
              />
            </TouchableOpacity>
          }
        </View>
        {locationList.length != 0 &&
          <TopTab
            locationList={locationList}
            tabChange={(e) => {
              this._header.didChangeText(locationList[e].location_name)
              this.currentPage = e
              if (this.backgroundList.length >= e) {
                this._background.didChangeImage(this.backgroundList[e])
              }
            }}
            backGroundChange={(bg) => {
              this._background.didChangeImage(bg)
              this.backgroundList[this.currentPage] = bg
            }}
            onDisable={() => this.setState({ disable: true })}
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
