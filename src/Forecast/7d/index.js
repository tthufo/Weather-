import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl, ScrollView,
} from 'react-native';
import { Container, Text } from 'native-base';
import IC from '../../elements/icon';
import GetLocation from 'react-native-get-location'
import API from '../../apis';
import _ from 'lodash';
import moment from 'moment';

const os = Platform.OS;

const numColumns = 7;
const size = (Dimensions.get('window').width / numColumns);

const plays = 100;

const LINE = ({ max, min, hay, means, meanest }) => {
  return (
    <View style={{ height: 390 - plays }}>
      <View style={{ alignItems: 'center', position: 'absolute', left: -((size - 20) / 2) + 3, top: ((340 - plays) - hay) - ((min - meanest) * means) }}>
        <Text style={{ color: '#4B8266', fontSize: 18, fontWeight: 'bold' }}>{max}°</Text>
        <View style={{ borderRadius: 10, height: hay, width: 20, backgroundColor: '#4B8266' }}>
        </View>
        <Text style={{ color: '#4B8266', fontSize: 18, fontWeight: 'bold' }}>{min}°</Text>
      </View>
    </View>
  );
}

export default class weather extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      weather: [],
      means: 0,
    };
    this.onRefresh = _.debounce(this.onRefresh, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    setTimeout(() => {
      this.getLocation();
    }, 1000)
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
        type: 3,
      });
      this.setState({ isRefreshing: false });
      if (weather.data.statusCode != 200) {
        return
      }
      console.log(weather)

      this.setState({ weather: weather.data && weather.data.data.resultGmos });
      const maxs = weather.data.data.resultGmos.map(e => {
        return Math.round(e.air_temperature_max)
      })
      const mins = weather.data.data.resultGmos.map(e => {
        return Math.round(e.air_temperature_min)
      })
      const means = (340 - plays) / (Math.max(...maxs) - Math.min(...mins))
      this.setState({ means })
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

  days(time) {
    const day = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7']
    const date = moment(time, 'hh:mm DD/MM/YYYY');
    const dow = date.day();
    return day[dow]
  }

  render() {
    const { isRefreshing, weather, means } = this.state;
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    const minest = weather.map(e => {
      return Math.round(e.air_temperature_min)
    })
    console.log(means)
    return (
      <View style={{ flexGrow: 1, alignItems: 'center' }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={weather}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  width: size - 0.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 520 - plays,
                }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.days(item.time)}</Text>
                <Image
                  style={{ height: 30, width: 30, marginTop: 20 }}
                  source={ICON[Math.round(item.weather) - 1].icon || ''}
                />
                {means != 0 &&
                  <LINE
                    min={Math.round(item.air_temperature_min)}
                    max={Math.round(item.air_temperature_max)}
                    hay={(Math.round(item.air_temperature_max) - Math.round(item.air_temperature_min)) * means}
                    means={means}
                    meanest={Math.min(...minest)}
                  />}

                <View style={{ width: size - 10, height: 0.5, backgroundColor: 'gray' }} />
                <Image
                  style={{ height: 20, width: 20 }}
                  source={require('../../../assets/images/ic_humidity_one.png')}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B8266' }}>{Math.round(item.relative_humidity)}%</Text>

              </View>
              <View style={{ width: 0.5, height: (400), backgroundColor: 'gray' }} />
            </View>
          )}
          numColumns={numColumns}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{
            flexDirection: 'row',
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 3,
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
});
