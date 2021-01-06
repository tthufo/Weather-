import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import STG from '../../service/storage';
import API from '../apis';
import HOST from '../apis/host';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { Header } from '../elements';
import IC from '../elements/icon';
import NavigationService from '../../service/navigate';
import Address from '../elements/Address';
import _ from 'lodash';
import TopTab from './toptab';
import MarqueeLabel from 'react-native-lahk-marquee-label';
import DeviceInfo from 'react-native-device-info';

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

export default class main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isConnected: true,
      weather: {},
      loading: true,
      page: 0,
    };

    this.currentPage = 0;
    this.navigation = null;
  }

  componentDidMount() {
    this.getLocation()
  }

  getLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        // this.getWeather(location);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  async getLocation() {
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
      console.log('===>', weather)
      this.setState({ weather: weather.data.result });
    } catch (e) {
      this.setState({ loading: false, isRefreshing: false });
      console.log(e)
    }
  }

  render() {
    const { weather, loading, page } = this.state;
    const resultGmos = weather.resultGmos && weather.resultGmos[0]
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Image
          style={{ width: width, height: height, resizeMode: 'cover', position: 'absolute', top: 0, left: 0 }}
          source={page == 0 ? require('../../assets/images/bg_06.png') : require('../../assets/images/bg_03.png')}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
          <TouchableOpacity onPress={() => NavigationService.navigate('LocationListScreen', {})}>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../../assets/images/ico_place.png')}
            />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              HaNoi
            </Text>
          </View>
          <TouchableOpacity>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../../assets/images/ico_setting.png')}
            />
          </TouchableOpacity>
        </View>
        <TopTab
          tabChange={(e) => {
            if (e != page) {
              this.setState({ page: e })
            }
          }}
          navi={(navigation) => this.navigation = navigation}
          onRef={(ref) => this.navigation = ref}
        />
        {/* <Button onPress={() => this.navigation.didChangeTab('5')} >
          <Text>sdfds</Text>
        </Button> */}
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
