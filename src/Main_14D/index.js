import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl, SafeAreaView,
} from 'react-native';
import { Text, Content } from 'native-base';
import IC from '../elements/icon';
import { Header } from '../elements';
import { temperature, weatherImage, wind, windUnit } from '../Utils/helper';
import API from '../apis';
import _ from 'lodash';
import moment from 'moment';

const os = Platform.OS;

const numColumns = 14;

const size = (Dimensions.get('window').width / numColumns);

const plays = 100;

const LINE = ({ max, min, hay, means, meanest }) => {
  return (
    <View style={{ height: 390 - plays }}>
      <View style={{ alignItems: 'center', position: 'absolute', left: -((60 - 15) / 2) + 15, top: ((340 - plays) - hay) - ((min - meanest) * means) }}>
        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'normal' }}>{max}°</Text>
        <View style={{ borderRadius: 10, height: hay, width: 12, backgroundColor: '#3629EF' }}>
        </View>
        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'normal' }}>{min}°</Text>
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
    this.getWeather()
  }

  async getWeather() {
    const { navigation: { state: { params: { latLong } } } } = this.props;
    this.setState({ loading: true, isRefreshing: true });
    try {
      const weather = await API.home.getWeather24({
        latitude: latLong.lat,
        longitude: latLong.lng,
        type: 3,
      });
      this.setState({ loading: false, isRefreshing: false });
      if (weather.data.status != 200) {
        return
      }
      weather.data.result.reverse().map((e, index) => {
        (async () => {
          e['temperature'] = await temperature(e.air_temperature)
          e['temperature_feeling'] = await temperature(e.temperature_feel)
          e['winding'] = await wind(e.wind_speed)
          e['wind_unit'] = await windUnit()
          e['timer'] = e.time.split(' ')[0]
          const day = e.time.split(' ')[1]
          e['day'] = day.split('/')[0] + '/' + day.split('/')[1]
          e['week_day'] = index == 0 ? 'Hôm nay' : index == 1 ? 'Ngày mai' : this.days(e.time)
        })()
      })

      const maxs = weather.data.result.map(e => {
        return Math.round(e.air_temperature_max)
      })
      const mins = weather.data.result.map(e => {
        return Math.round(e.air_temperature_min)
      })
      const means = (340 - plays) / (Math.max(...maxs) - Math.min(...mins))
      setTimeout(() => {
        this.setState({ means, weather: weather.data.result })
      }, 500)
    } catch (e) {
      this.setState({ loading: false, isRefreshing: false });
      console.log(e)
    }
  }

  onRefresh() {
    this.setState({ isRefreshing: true }, () => {
      this.getWeather()
    });
  }

  days(time) {
    const day = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
    const date = moment(time, 'hh:mm DD/MM/YYYY');
    const dow = date.day();
    return day[dow]
  }

  render() {
    const { isRefreshing, weather, means } = this.state;
    console.log(weather)
    const { navigation, navigation: { state: { params: { locationName } } } } = this.props;
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    const minest = weather.map(e => {
      return Math.round(e.air_temperature_min)
    })
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header navigation={navigation} color={'transparent'} title={locationName} />
        <Content
          style={{ backgroundColor: 'transparent' }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => this.onRefresh()}
            />}
        >
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={weather}
            horizontal={true}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    width: 60,//size - 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 520 - plays,
                  }}>
                  <Text style={{ fontSize: 12 }}>{item.week_day}</Text>
                  <Text style={{ fontSize: 12, margin: 5 }}>{item.day}</Text>
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={weatherImage(Math.round(item.weather) - 1)}
                  />
                  {means != 0 &&
                    <LINE
                      min={Math.round(item.air_temperature_min)}
                      max={Math.round(item.air_temperature_max)}
                      hay={(Math.round(item.air_temperature_max) - Math.round(item.air_temperature_min)) * means}
                      means={means}
                      meanest={Math.min(...minest)}
                    />}
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      style={{ height: 20, width: 20 }}
                      source={require('../../assets/images/rain_probalility.png')}
                    />
                    <Text style={{ fontSize: 14, color: 'black', textAlign: 'center' }}>{Math.round(item.probability_rain)}%</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: 'black', textAlign: 'center' }}>--</Text>
                </View>
              </View>
            )}
            // numColumns={numColumns}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{
              flexDirection: 'row',
            }}
          />
        </Content>
      </SafeAreaView>
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
