import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl, SafeAreaView,
} from 'react-native';
import { Text, Content } from 'native-base';
import IC from '../elements/icon';
import { Header } from '../elements';
import RBSheet from "react-native-raw-bottom-sheet";
import { temperature, weatherImage, wind, windUnit, formatUv } from '../Utils/helper';
import API from '../apis';
import _ from 'lodash';
import moment from 'moment';

const os = Platform.OS;

const numColumns = 14;

const size = (Dimensions.get('window').width / numColumns);

const plays = 100;

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

const CONFIG = [
  { title: 'Nhiệt độ cao nhất', key: 'temperature_max', unit: '°' },
  { title: 'Nhiệt độ thấp nhất', key: 'temperature_min', unit: '°' },
  { title: 'Khả năng mưa', key: 'probability_rain', unit: '%' },
  { title: 'Độ ẩm', key: 'relative_humidity', unit: '%' },
  { title: 'Gió', key: 'winding' },
  { title: 'UV', key: 'uvIndex', unit: '' },
  { title: 'Điểm sương', key: 'dew_point', unit: '°' },
  { title: 'Mặt trời mọc', key: 'sunrise', unit: '' },
  { title: 'Mặt trời lặn', key: 'sunset', unit: '' }]

const LINE = ({ max, min, hay, means, meanest, displayMin, displayMax }) => {
  return (
    <View style={{ height: 390 - plays }}>
      <View style={{ alignItems: 'center', position: 'absolute', left: -((60 - 15) / 2) + 15, top: ((340 - plays) - hay) - ((min - meanest) * means) }}>
        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'normal' }}>{displayMax}°</Text>
        <View style={{ borderRadius: 10, height: hay, width: 12, backgroundColor: '#3629EF' }}>
        </View>
        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'normal' }}>{displayMin}°</Text>
      </View>
    </View>
  );
}

const MODAL = ({ data }) => {
  return (
    <View style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10, marginTop: 10 }}>
        <View style={{ height: 35, width: 35 }} />
        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'normal' }}>{data.week_day}, {data.day}</Text>
        <Image
          style={{ height: 35, width: 35 }}
          source={require('../../assets/images/rain_probalility.png')}
        />
      </View>

      <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginRight: 10, marginLeft: 10 }}>
        {CONFIG.map((item, index) => (
          <View index={index} key={index}>
            <View style={{
              width: '100%',
              height: 40, flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text>{item.title}</Text>
              {item.key == 'winding' ?
                <Text>
                  {Winding(data.wind_direction)} {data[item.key]}{data.wind_unit}
                </Text>
                : item.key == 'uvIndex' ?
                  <Text>
                    {formatUv(data[item.key])} {data[item.key]}{item.unit}
                  </Text>
                  :
                  <Text>
                    {item.key == 'sunset' || item.key == 'sunrise' ? data[item.key] : Math.round(data[item.key])}{item.unit}
                  </Text>
              }
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: 'black' }} />
          </View>
        ))}
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
      modalData: {},
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
          e['temperature_max'] = await temperature(e.air_temperature_max)
          e['temperature_min'] = await temperature(e.air_temperature_min)
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
    const { isRefreshing, weather, means, modalData } = this.state;
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
        <Text style={{ fontSize: 16, color: '#3629EF', textAlign: 'center' }}>{'14 Ngày tới'}</Text>
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
                    height: 550 - plays,
                  }}>
                  <Text style={{ fontSize: 12 }}>{item.week_day}</Text>
                  <Text style={{ fontSize: 12, margin: 5 }}>{item.day}</Text>
                  <Image
                    style={{ height: 30, width: 30 }}
                    source={weatherImage(Math.round(item.weather) - 1)}
                  />
                  {means != 0 &&
                    <TouchableOpacity onPress={() => this.setState({ modalData: item }, () => this.modal.open()
                    )}>
                      <LINE
                        min={Math.round(item.air_temperature_min)}
                        max={Math.round(item.air_temperature_max)}
                        displayMin={Math.round(item.temperature_min)}
                        displayMax={Math.round(item.temperature_max)}
                        hay={(Math.round(item.air_temperature_max) - Math.round(item.air_temperature_min)) * means}
                        means={means}
                        meanest={Math.min(...minest)}
                      />
                    </TouchableOpacity>
                  }
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
            keyExtractor={(item, index) => index}
            contentContainerStyle={{
              flexDirection: 'row',
            }}
          />
          <RBSheet
            ref={ref => {
              this.modal = ref;
            }}
            closeOnPressMask={true}
            height={450}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'transparent'
              }
            }}
          >
            <MODAL data={modalData} />
          </RBSheet>
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
