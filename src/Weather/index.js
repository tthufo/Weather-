import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Container, Content, Text } from 'native-base';
import NavigationService from '../../service/navigate';
import { temperature, tempUnit } from '../Utils/helper';
import IC from '../elements/icon';
import API from '../apis';
import _ from 'lodash';
import Header from './header';
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

const SUMMARY = ({ image, title }) => {
  return (
    <View style={{ borderRadius: 14, margin: 15, backgroundColor: 'tranparent', flex: 1, height: 330, justifyContent: 'flex-start', alignItems: 'center' }}>
      <View style={{ borderRadius: 14, backgroundColor: 'white', opacity: 0.3, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />


      <View style={{ backgroundColor: 'green', width: '99%', height: 80, margin: 5 }}>
        <Text>image</Text>
      </View>


      <View style={{ width: '99%', justifyContent: 'space-between', flexDirection: 'row', paddingRight: 5, paddingLeft: 5, marginTop: 10, marginBottom: 10 }}>
        <View style={{}}>
          <Text style={{ color: 'white', marginBottom: 5 }}>
            {'Mặt trời mọc'}
          </Text>
          <Text style={{ color: 'white' }}>
            {'11:11'}
          </Text>
        </View>
        <View style={{}}>
          <Text style={{ color: 'white', marginBottom: 5 }}>
            {'Mặt trời lặn'}
          </Text>
          <Text style={{ color: 'white' }}>
            {'11:00'}
          </Text>
        </View>
      </View>

      <View style={{ width: '99%', flexDirection: 'row', paddingRight: 5, paddingLeft: 5, flexWrap: 'wrap' }}>
        {['', '', '', '', '', ''].map(item =>
          <View style={{ width: '50%', marginBottom: 12 }}>
            <Text style={{ color: '#A0B7DB', marginBottom: 5, fontSize: 16 }}>
              {'GIÓ'}
            </Text>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              {'11:00'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};


const COLOR = ["#DFEEB6", "#E9DEB3", "#F1D4B7", "#DCE5CB", "#DFEEB6", "#E9DEB3", "#F1D4B7", "#DCE5CB"]

export default class weather extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      token: null,
      isConnected: true,
      crops: [],
      selectedCrop: 0,
      weather: {},
      loading: true,
    };
  }

  componentDidMount() {
    const { latitude, longitude } = this.props;
    this.getWeather({ lat: latitude, lng: longitude });
  }

  async getWeather(location) {
    this.setState({ loading: true });
    try {
      const weather = await API.home.getWeather24({
        latitude: location.lat,
        longitude: location.lng,
        type: 1,
      });
      this.setState({ loading: false });
      if (weather.data.status != 200) {
        return
      }
      weather.data.result.map(e => {
        (async () => {
          e['temperature'] = await temperature(e.air_temperature)
          e['temperature_feeling'] = await temperature(e.temperature_feel)
          e['temp_unit'] = await tempUnit()
        })()
      })
      setTimeout(() => {
        this.setState({ weather: weather.data.result[0] }, () => {
          if (this._header) {
            this._header.didChangeData(this.state.weather)
          }
          if (this._weather) {
            this._weather.didReload()
          }
        });
      }, 500)
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  render() {
    const { weather, loading } = this.state;
    const { latitude, longitude, location_name } = this.props;
    const ready = Object.keys(weather).length != 0
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <Container style={{ backgroundColor: 'transparent' }}>
        <Content
          style={{ backgroundColor: 'transparent' }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => this.getWeather({ lat: latitude, lng: longitude })}
              tintColor="white"
            />}
        >
          {/* <View style={{ backgroundColor: 'transparent', flex: 1, padding: 5, flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 60, color: 'white' }}>{ready && weather.temperature || '-'}</Text>
            <Text style={{ fontSize: 30, color: 'white' }}>{ready && weather.temp_unit}</Text>
          </View>
          <View style={{ backgroundColor: 'transparent', flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold', marginBottom: 10 }}>{ready && ICON[Math.round(weather.weather) - 1].name || '-'}</Text>
            <Text style={{ fontSize: 16, color: 'white' }}>{`Cảm nhận ${ready && weather.temperature_feeling || '-'}${ready && weather.temp_unit || ''}`} </Text>
          </View> */}
          {ready && <Header onRef={component => this._header = component} />}

          <Weather24 onRef={component => this._weather = component} locationName={location_name} latLong={{ lat: latitude, lng: longitude }} />

          <TouchableOpacity onPress={() => {
            NavigationService.navigate('Main14DayScreen', { locationName: location_name, latLong: { lat: latitude, lng: longitude } })
          }}>
            <View style={{ borderRadius: 14, margin: 15, backgroundColor: 'tranparent', flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ borderRadius: 14, backgroundColor: 'white', opacity: 0.3, width: '100%', height: 50, position: 'absolute', top: 0, left: 0 }} />
              <Text style={{ width: '100%', textAlign: 'center', color: 'white' }}>
                {'14 Ngày Tới'}
              </Text>
            </View>
          </TouchableOpacity>

          <SUMMARY />

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
