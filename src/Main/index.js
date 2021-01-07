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
      locationName: 'WeatherPlus'
    };

    this.currentPage = 0;
    this.navigation = null;
  }

  componentDidMount() {
    this.getCurrentLocation()
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
        device_id: 'b43bb6dc61d9fa9c', //getUniqueId(),
        weather: null,
      });
      this.setState({ loading: false });
      if (weather.data.status != 200) {
        return
      }
      this.setState({ locationList: [Object.keys(currentLocation).length == 0 ? DEFAULT : currentLocation, ...weather.data.result] }, () => {
        // console.log(this.state.locationList)
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
          if (this._background) {
            this._background.didChangeImage('bg_06')
          }
          this.setState({ currentLocation: { location_id: -1, location_name: currentAddress, latitude, longitude, device_id: DeviceInfo.getUniqueId() } }, () => this.getLocation())
        }
      });
  }

  render() {
    const { locationList, loading, page, locationName } = this.state;
    // const resultGmos = weather.resultGmos && weather.resultGmos[0]
    // var d = new Date();
    // var h = d.getHours();
    // const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {/* <Image
          style={{ width: width, height: height, resizeMode: 'cover', position: 'absolute', top: 0, left: 0 }}
          source={page == 0 ? require('../../assets/images/bg_06.png') : require('../../assets/images/bg_03.png')}
        /> */}
        <BackGround onRef={component => this._background = component} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
          <TouchableOpacity onPress={() => NavigationService.navigate('LocationListScreen', {})}>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../../assets/images/ico_place.png')}
            />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <Heading onRef={component => this._header = component} />
          </View>
          <TouchableOpacity>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../../assets/images/ico_setting.png')}
            />
          </TouchableOpacity>
        </View>
        {locationList.length != 0 &&
          <TopTab
            locationList={locationList}
            tabChange={(e) => {
              this._header.didChangeText(locationList[e].location_name)
              this._background.didChangeImage(e)
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
