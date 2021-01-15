import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Container, Content, Text } from 'native-base';
import NavigationService from '../../service/navigate';
import { temperature, tempUnit, windUnit, wind, formatUv } from '../Utils/helper';
import IC from '../elements/icon';
import API from '../apis';
import _ from 'lodash';
import Header from './header';
import Weather24 from '../Main_24H';

function Winding(deg) {
  if (deg == null) return { 'direction': "-", 'icon': require('../../assets/images/bg_blur.png') };
  else if (deg >= 11.25 && deg < 33.75) return { 'direction': "BĐB", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 33.75 && deg < 56.25) return { 'direction': "ĐB", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 56.25 && deg < 78.75) return { 'direction': "ĐĐB", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 78.75 && deg < 101.25) return { 'direction': "Đ", 'icon': require('../../assets/images/E.png') };
  else if (deg >= 101.25 && deg < 123.75) return { 'direction': "ĐĐN", 'icon': require('../../assets/images/SE.png') };
  else if (deg >= 123.75 && deg < 146.25) return { 'direction': "ĐN", 'icon': require('../../assets/images/SE.png') };
  else if (deg >= 146.25 && deg < 168.75) return { 'direction': "NĐN", 'icon': require('../../assets/images/SE.png') };
  else if (deg >= 168.75 && deg < 191.25) return { 'direction': "N", 'icon': require('../../assets/images/S.png') };
  else if (deg >= 191.25 && deg < 213.75) return { 'direction': "NTN", 'icon': require('../../assets/images/SW.png') };
  else if (deg >= 213.75 && deg < 236.25) return { 'direction': "TN", 'icon': require('../../assets/images/SW.png') };
  else if (deg >= 236.25 && deg < 258.75) return { 'direction': "TTN", 'icon': require('../../assets/images/SW.png') };
  else if (deg >= 258.75 && deg < 281.25) return { 'direction': "T", 'icon': require('../../assets/images/W.png') };
  else if (deg >= 281.25 && deg < 303.75) return { 'direction': "TTB", 'icon': require('../../assets/images/NW.png') };
  else if (deg >= 303.75 && deg < 326.25) return { 'direction': "TB", 'icon': require('../../assets/images/NW.png') };
  else if (deg >= 326.25 && deg < 348.75) return { 'direction': "BTB", 'icon': require('../../assets/images/NW.png') };
  else if (deg >= 348.75 || deg < 11.25) return { 'direction': "B", 'icon': require('../../assets/images/N.png') };
  else return { 'direction': "-", 'icon': require('../../assets/images/bg_blur.png') };
}

function AQI(deg) {
  if (deg == null) return { 'direction': "-", 'icon': require('../../assets/images/bg_blur.png') };
  else if (deg >= 0 && deg < 50) return { 'direction': "Tốt", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 51 && deg < 100) return { 'direction': "Trung Bình", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 101 && deg < 150) return { 'direction': "Kém", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 151 && deg < 200) return { 'direction': "Xấu", 'icon': require('../../assets/images/E.png') };
  else if (deg >= 201 && deg < 300) return { 'direction': "Rất Xấu", 'icon': require('../../assets/images/SE.png') };
  else if (deg >= 301 && deg < 500) return { 'direction': "Nguy Hại", 'icon': require('../../assets/images/SE.png') };
  else return { 'direction': "-", 'icon': require('../../assets/images/bg_blur.png') };
}


const CONFIG = [
  { title: 'Độ ẩm', key: 'relative_humidity', unit: '%' },
  { title: 'Gió', key: 'winding' },
  { title: 'Tầm nhìn', key: 'visibility', unit: 'km' },
  { title: 'Điểm sương', key: 'dew_point', unit: '°' },
  { title: 'UV', key: 'uvIndex', unit: '' },
  { title: 'AQI', key: 'aqi', unit: '' }]

const SUMMARY = ({ data }) => {
  return (
    <View style={{ borderRadius: 14, margin: 15, backgroundColor: 'tranparent', flex: 1, height: 330, justifyContent: 'flex-start', alignItems: 'center' }}>
      <View style={{ borderRadius: 14, backgroundColor: 'white', opacity: 0.3, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />


      <View style={{ width: '99%', height: 80, margin: 5 }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
          source={require('../../assets/images/sunrise_set.png')}
        />
      </View>


      <View style={{ width: '99%', justifyContent: 'space-between', flexDirection: 'row', paddingRight: 5, paddingLeft: 5, marginTop: 10, marginBottom: 10 }}>
        <View style={{}}>
          <Text style={{ color: 'white', marginBottom: 5 }}>
            {'Mặt trời mọc'}
          </Text>
          <Text style={{ color: 'white' }}>
            {data.sunrise || ''}
          </Text>
        </View>
        <View style={{}}>
          <Text style={{ color: 'white', marginBottom: 5 }}>
            {'Mặt trời lặn'}
          </Text>
          <Text style={{ color: 'white' }}>
            {data.sunset || ''}
          </Text>
        </View>
      </View>

      <View style={{ width: '99%', flexDirection: 'row', paddingRight: 5, paddingLeft: 5, flexWrap: 'wrap' }}>
        {CONFIG.map(item =>
          <View style={{ width: '50%', marginBottom: 12 }}>
            <Text style={{ color: '#A0B7DB', marginBottom: 5, fontSize: 16 }}>
              {item.title}
            </Text>
            {item.key == 'winding' ?
              <Text style={{ color: 'white', fontSize: 16 }}>
                {Winding(data.wind_direction).direction} {data[item.key]} {data.wind_unit}
              </Text>
              : item.key == 'uvIndex' ?
                <Text style={{ color: 'white', fontSize: 16 }}>
                  {data[item.key]} {formatUv(data[item.key])}{item.unit}
                </Text> : item.key == 'aqi' ?
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {data[item.key] || '-'} {AQI(Math.round(data[item.key])).direction}
                  </Text> :
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    {data[item.key] || '-'} {item.unit}
                  </Text>}
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
    const { onChangeBackground, onDisable } = this.props;
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
      if (weather.data.result.length == 0) {
        if (onDisable) {
          onDisable()
        }
        return
      }
      weather.data.result.map(e => {
        (async () => {
          e['temperature'] = await temperature(e.air_temperature)
          e['temperature_feeling'] = await temperature(e.temperature_feel)
          e['winding'] = await wind(e.wind_speed)
          e['temp_unit'] = await tempUnit()
          e['wind_unit'] = await windUnit()
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
          if (onChangeBackground) {
            onChangeBackground(this.state.weather.weather)
          }
        });
      }, 800)
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  render() {
    const { weather, loading } = this.state;
    const { latitude, longitude, location_name } = this.props;
    const ready = weather && Object.keys(weather).length != 0
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

          {ready && <TouchableOpacity onPress={() => {
            NavigationService.navigate('Main14DayScreen', { locationName: location_name, latLong: { lat: latitude, lng: longitude } })
          }}>
            <View style={{ borderRadius: 14, margin: 15, backgroundColor: 'tranparent', flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ borderRadius: 14, backgroundColor: 'white', opacity: 0.3, width: '100%', height: 50, position: 'absolute', top: 0, left: 0 }} />
              <Text style={{ width: '100%', textAlign: 'center', color: 'white' }}>
                {'14 Ngày Tới'}
              </Text>
            </View>
          </TouchableOpacity>}

          {ready && <SUMMARY data={weather} />}

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
