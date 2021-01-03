import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import API from '../../apis';
import _ from 'lodash';
import IC from '../../elements/icon';
import Address from '../Address';
;
const os = Platform.OS;

const ROW = ({ title, value }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <Text style={{ fontSize: 15, alignSelf: 'center', marginTop: 5, flexWrap: 'wrap' }}>{title}: </Text>
      <Text style={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'center', marginTop: 5, flexWrap: 'wrap' }}>{value}</Text>
    </View>
  );
};

const UNIT = [
  { title: 'Nhiệt độ cảm nhận', unit: '°C' },
  { title: 'Khả năng mưa', unit: '%' },
  { title: 'Chỉ số UV', unit: '' },
  { title: 'Chất lượng không khí', unit: '' },
  { title: 'Gió', unit: ' Km', windy: true },
  { title: 'Độ ẩm', unit: '%' },
]

const WIND = ['Bắc',
  'Bắc Đông Bắc',
  'Đông Bắc',
  'Đông Đông Bắc',
  'Đông',
  'Đông Đông Nam',
  'Đông Nam',
  'Nam Đông Nam',
  'Nam',
  'Nam Tây Nam',
  'Tây Nam',
  'Tây Tây Nam',
  'Tây',
  'Tây Tây Bắc',
  'Tây Bắc',
  'Bắc Tây Bắc']

function Winding(deg) {
  if (deg == null) return "-";
  else if (deg >= 11.25 && deg < 33.75) return "Bắc Đông Bắc";
  else if (deg >= 33.75 && deg < 56.25) return "Đông Bắc";
  else if (deg >= 56.25 && deg < 78.75) return "Đông Đông Bắc";
  else if (deg >= 78.75 && deg < 101.25) return "Đông";
  else if (deg >= 101.25 && deg < 123.75) return "Đông Đông Nam";
  else if (deg >= 123.75 && deg < 146.25) return "Đông Nam";
  else if (deg >= 146.25 && deg < 168.75) return "Nam Đông Nam";
  else if (deg >= 168.75 && deg < 191.25) return "Nam";
  else if (deg >= 191.25 && deg < 213.75) return "Nam Tây Nam";
  else if (deg >= 213.75 && deg < 236.25) return "Tây Nam";
  else if (deg >= 236.25 && deg < 258.75) return "Tây Tây Nam";
  else if (deg >= 258.75 && deg < 281.25) return "Tây";
  else if (deg >= 281.25 && deg < 303.75) return "Tây Tây Bắc";
  else if (deg >= 303.75 && deg < 326.25) return "Tây Bắc";
  else if (deg >= 326.25 && deg < 348.75) return "Bắc Tây Bắc";
  else if (deg >= 348.75 || deg < 11.25) return "Bắc";
  else return "-";
}

function formatAqi(saqi) {
  if (saqi == null) {
    return "-"
  } else {
    const aqi = Math.round(saqi)
    if (aqi >= 0 && aqi <= 50) return "Tốt";
    else if (aqi >= 51 && aqi <= 100) return "Trung bình";
    else if (aqi >= 101 && aqi <= 150) return "Kém";
    else if (aqi >= 151 && aqi <= 200) return "Xấu";
    else if (aqi >= 201 && aqi <= 300) return "Rất xấu";
    else if (aqi > 300) return "Nguy hại";
    else return "-";
  }
}

function formatUv(uv) {
  if (uv == null) return "-";
  else if (uv >= 0 && uv <= 2) return "Thấp";
  else if (uv >= 3 && uv <= 5) return "Trung bình";
  else if (uv >= 6 && uv <= 7) return "Cao";
  else if (uv >= 8 && uv <= 10) return "Rất cao";
  else if (uv >= 11) return "Nguy hại";
  else return "-";
}

export default class weatherHead extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weather: {},
      loading: true,
      latLong: null,
    };
  }

  componentDidMount() {
    const { delay } = this.props;
    setTimeout(() => {
      this.getLocation();
    }, delay ? delay : 100)
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
      if (weather.data.statusCode != 200) {
        return
      }
      this.setState({ loading: false });
      this.setState({ weather: weather.data.data });
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  getDetail() {
    const { weather } = this.state;
    const result = weather.resultGmos && weather.resultGmos[0];
    const detail = [
      result && Math.round(result.temperatureFeel).toString() || '',
      result && Math.round(result.probability_rain).toString() || '',
      result && formatUv(weather.uvIndex) || '',
      result && formatAqi(weather.dataPamair.aqi.value) || '',
      result && Math.round(result.wind_speed).toString() || '',
      result && Math.round(result.relative_humidity).toString() || '',
    ]
    return detail
  }

  render() {
    const { weather, loading, latLong } = this.state;
    const { delay } = this.props;
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    const resultGmos = weather.resultGmos && weather.resultGmos[0]
    return (
      <View style={{ flexDirection: 'row', padding: 5 }}>
        <View style={{ flex: 1, padding: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Image
              style={{ width: 30, height: 30 }}
              source={require('../../../assets/images/location.png')}
            />
            {latLong != null && <Address latLong={latLong} delay={delay} style={{ fontSize: 15, alignSelf: 'center', color: '#4B8266' }} />}
          </View>
          <View>
            {loading ? <ActivityIndicator style={{ height: 60, width: 60 }} size="large" color="#4B8266" />
              :
              <TouchableOpacity onPress={() => {
                this.getLocation();
              }}>
                <Image
                  style={{ width: 60, height: 60, marginTop: 5, marginBottom: 5 }}
                  source={resultGmos && ICON[Math.round(resultGmos.weather) - 1].icon || ''}
                />
              </TouchableOpacity>}
          </View>
          <Text style={{ color: '#4B8266', fontWeight: 'bold', flexWrap: 'wrap' }}>{resultGmos && ICON[Math.round(resultGmos.weather) - 1].name}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 45, color: '#4B8266' }}>{resultGmos && Math.round(resultGmos.air_temperature) || ''}°</Text>
            <Text style={{ fontSize: 11, color: '#4B8266', alignSelf: 'flex-end', marginBottom: 10 }}>{resultGmos && Math.round(resultGmos.air_temperature_max) || ''}° | {resultGmos && Math.round(resultGmos.air_temperature_min) || ''}°</Text>
          </View>
        </View>

        <View style={{ flex: 1, padding: 5 }}>
          {UNIT.map((e, index) => {
            return (
              <ROW title={e.title} value={this.getDetail()[index] + e.unit + (e.windy && resultGmos && resultGmos.wind_direction ? ` | ${Winding(resultGmos.wind_direction)}` : '')} />
            )
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
