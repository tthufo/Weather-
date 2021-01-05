import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
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
import Weather24 from '../Main_24H';

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

export default class main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login_info: {
        email: false,
        password: false
      },
      show_validation: false,
      modalVisible: false,
      token: null,
      isConnected: true,
      crops: [],
      selectedCrop: 0,
      weather: {},
      loading: true,
      latLong: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      // this.getLocation();
    }, 500)
    STG.getData('user').then(u => {
      // this.getCrops(u.subscribe);
    })
  }

  getLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        this.getWeather(location);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  async getWeather(location) {
    this.setState({ loading: true });
    this.setState({ latLong: { lat: location.latitude, long: location.longitude } })
    try {
      const show = STG.getData('auto')
      const weather = await API.home.getWeather({
        latitude: show ? 21.028511 : location.latitude,
        longtitude: show ? 105.804817 : location.longitude,
        type: 1,
      });
      this.setState({ loading: false });
      if (weather.data.statusCode != 200) {
        return
      }
      this.setState({ weather: weather.data.data });
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  async getCrops(subscriber) {
    var bodyFormData = new FormData();
    const show = await STG.getData('auto')
    const userInfo = await STG.getData('token')
    bodyFormData.append('subscriber', subscriber);
    axios({
      method: 'post',
      url: HOST.BASE_URL + '/appcontent/cropsUser/list-crops-user',
      data: bodyFormData,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Authorization': 'bearer ' + userInfo.access_token,
      }
    }).then(r => {
      if (r.status != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return;
      }
      const resign = r.data.data.filter(e => show ? (e.cropsUserId != null && e.cropsId != 27 && e.cropsId != 28) : e.cropsUserId != null).map((e, index) => {
        e.check = index == 0 ? true : false;
        return e;
      });
      this.setState({
        crops: resign.filter(e => e.cropsUserId != null),
      })
    }).catch(e => {
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  handleChange = (index) => {
    var newData = [...this.state.crops];
    newData.map(e => {
      e.check = false
    })
    newData[index].check = true;
    this.setState({ crops: newData, selectedCrop: index });
  };

  reload() {
    STG.getData('user').then(u => {
      this.setState({ selectedCrop: 0 }, () => {
        this.getCrops(u.subscribe);
      })
    })
  }

  render() {
    const { crops, selectedCrop, weather, loading, latLong } = this.state;
    const resultGmos = weather.resultGmos && weather.resultGmos[0]
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <Container style={{ backgroundColor: 'transparent' }}>
        <Content
          style={{ backgroundColor: 'transparent' }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              // onRefresh={}
              tintColor="white"
            />}
        >
          <View style={{ backgroundColor: 'transparent', flex: 1, padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
            {loading ? <ActivityIndicator size="large" color="white" />
              :
              <TouchableOpacity onPress={() => {
                this.getLocation();
              }}>
                <Image
                  style={{ width: 70, height: 70, marginRight: 5 }}
                  source={resultGmos && ICON[Math.round(resultGmos.weather) - 1].icon || ''}
                />
              </TouchableOpacity>}
            <Text style={{ fontSize: 60, color: 'white' }}>{resultGmos && Math.round(resultGmos.air_temperature) || '--'}</Text>
            <Text style={{ fontSize: 30, color: 'white' }}>°C</Text>
          </View>
          <View style={{ backgroundColor: 'transparent', flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, color: 'white' }}>{`Nhiệt độ cảm nhận ${resultGmos && Math.round(resultGmos.temperatureFeel).toString() || '--'}°C`} </Text>
            <Text style={{ fontSize: 17, color: 'white' }}>{resultGmos && ICON[Math.round(resultGmos.weather) - 1].name || '--'}</Text>
          </View>
          <Weather24 latLong={{ lat: 21.028511, lng: 105.804817 }} />

          <TouchableOpacity>
            <View style={{ borderRadius: 14, margin: 15, backgroundColor: 'tranparent', flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ borderRadius: 14, backgroundColor: 'white', opacity: 0.3, width: '100%', height: 50, position: 'absolute', top: 0, left: 0 }} />
              <Text style={{ width: '100%', textAlign: 'center', color: 'white' }}>
                {'14 Ngày Tới'}
              </Text>
            </View>
          </TouchableOpacity>

        </Content>
      </Container>
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
