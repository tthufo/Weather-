import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, Image, FlatList, Dimensions, RefreshControl, ScrollView,
} from 'react-native';
import { Container, Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import IC from '../../elements/icon';
import API from '../../apis';
import _ from 'lodash';

const os = Platform.OS;

const numColumns = 4;
const size = (Dimensions.get('window').width / numColumns);
const widthSize = (Dimensions.get('window').width / 1);

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

export default class weather extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weather: [],
      isRefreshing: true,
    };
    this.onRefresh = _.debounce(this.onRefresh, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    setTimeout(() => {
      this.getLocation();
    }, 500)
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
    try {
      const weather = await API.home.getWeather({
        latitude: location.latitude,
        longtitude: location.longitude,
        type: 2,
      });
      this.setState({ isRefreshing: false });
      if (weather.data.statusCode != 200) {
        return
      }
      this.setState({ weather: weather.data && weather.data.data.resultGmos });

    } catch (e) {
      this.setState({ isRefreshing: false });
      console.log(e)
    }
  }

  onRefresh() {
    this.setState({ isRefreshing: true }, () => {
      this.getLocation()
    });
  }

  render() {
    const { navigation } = this.props;
    const { crops, isRefreshing, mode, weather } = this.state;
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <Container>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 50 }}>
          <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ width: size, color: '#4B8266', fontWeight: 'bold', textAlign: 'center' }}>
              Thời gian
          </Text>
          </View>
          <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../../assets/images/ic_temp.png')}
            />
          </View>
          <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../../assets/images/ic_wind.png')}
            />
          </View>
          <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../../assets/images/ic_hum.png')}
            />
          </View>
        </View>

        <View style={{ height: 1, width: widthSize, backgroundColor: '#4B8266' }} />

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={weather}
          renderItem={({ item, index }) => (
            <View>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 60,
                }}>
                <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 5 }}>{item.time.split(' ')[0]}</Text>
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={ICON[Math.round(item.weather) - 1].icon || ''}
                  />
                </View>
                <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{Math.round(item.air_temperature)}°C</Text>
                </View>
                <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 15 }}>{Math.round(item.wind_speed)} km/h</Text>
                  <Text style={{ fontSize: 15, textAlign: 'center' }}>{Winding(item.wind_direction) || ''}</Text>
                </View>
                <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{Math.round(item.relative_humidity)}%</Text>
                </View>
              </View>
              <View style={{ height: 0.5, width: widthSize, backgroundColor: 'black' }} />
            </View>
          )}
          numColumns={1}
          keyExtractor={(item, index) => index}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  // item: {
  //   flex: 1,
  //   margin: 3,
  // },
  // image: {
  //   marginTop: 26,
  //   height: 40,
  //   width: 40
  // },
});
