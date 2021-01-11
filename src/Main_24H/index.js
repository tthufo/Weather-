import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Text } from 'native-base';
import API from '../apis';
import _ from 'lodash';
import NavigationService from '../../service/navigate';
import { temperature, weatherImage, wind, windUnit } from '../Utils/helper';

export default class weather24 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weather: [],
      loading: false,
    };

    this.didReload = this.didReload.bind(this);
  }

  componentDidMount() {
    this.didReload()
    if (this.props.onRef != null) {
      this.props.onRef(this, this.didReload);
    }
  }

  didReload() {
    const { latLong } = this.props;
    this.getWeather(latLong)
  }

  async getWeather(location) {
    this.setState({ loading: true });
    try {
      const weather = await API.home.getWeather24({
        latitude: location.lat,
        longitude: location.lng,
        type: 2,
      });
      this.setState({ loading: false });
      if (weather.data.status != 200) {
        return
      }
      weather.data.result.map(e => {
        (async () => {
          e['temperature'] = await temperature(e.air_temperature)
          e['temperature_feeling'] = await temperature(e.temperature_feel)
          e['winding'] = await wind(e.wind_speed)
          e['wind_unit'] = await windUnit()
          e['timer'] = e.time.split(' ')[0]
          const day = e.time.split(' ')[1]
          e['day'] = day.split('/')[0] + '/' + day.split('/')[1]
        })()
      })
      setTimeout(() => {
        this.setState({ weather: weather.data.result.reverse() });
      }, 800)
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  render() {
    const { weather, loading } = this.state;
    const { locationName } = this.props;
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
          <TouchableOpacity onPress={() => {
            NavigationService.navigate('Main24DetailScreen', { weatherData: weather, locationName })
          }}>
            <Text style={{ color: 'white' }}>
              {'XEM THÊM'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {loading ? <ActivityIndicator size="large" color="white" style={{ margin: 5 }} />
            :
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              horizontal={true}
              data={weather}
              renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      width: 60,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 150,
                    }}>
                    <Text style={{ fontSize: 12, color: '#A0B7DB' }}>{item.timer}</Text>
                    <Text style={{ fontSize: 12, color: 'white', margin: 5 }}>{item.temperature}°</Text>
                    <Image
                      style={{ height: 30, width: 30, margin: 5 }}
                      source={weatherImage(Math.round(item.weather) - 1)}
                    />
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        style={{ height: 20, width: 20 }}
                        source={require('../../assets/images/rain_probalility.png')}
                      />
                      <Text style={{ fontSize: 12, color: 'white' }}>{Math.round(item.probability_rain)}%</Text>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{
                flexDirection: 'row',
              }}
            />}
        </View>
      </View>
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
