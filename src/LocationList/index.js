import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
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
import _, { round } from 'lodash';
import { getUniqueId } from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

const CELL = ({ image, title, onPress }) => {
  console.log(title)
  return (
    <TouchableOpacity style={{ flex: 1, marginRight: 15, marginLeft: 15, marginBottom: 10 }} onPress={onPress}>
      <View style={{ paddingTop: 15, paddingBottom: 15, flex: 1, backgroundColor: '#4B8266', flexDirection: 'row', alignItems: 'center', borderRadius: 15, padding: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ marginLeft: 8, flex: 1, fontSize: 18, color: 'white', flexWrap: 'wrap', fontWeight: 'bold', marginBottom: 5 }}>
            {title.location_name && title.location_name.split('-')[0] || ''}
          </Text>
          <Text style={{ marginLeft: 8, flex: 1, fontSize: 17, color: 'white', flexWrap: 'wrap' }}>
            {title.location_name && title.location_name.split('-')[1] || ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', minWidth: 80, alignItems: 'center' }}>
          <Image
            style={{ height: 35, width: 35 }}
            source={require('../../assets/images/ic_humidity_one.png')}
          />
          <Text style={{ textAlign: 'center', fontSize: 20, color: 'white', flexWrap: 'wrap', fontWeight: 'bold' }}>
            {title.weather && title.weather.air_temperature && round(title.weather.air_temperature)} °
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default class locationlist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weather: [],
      loading: false,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.getLocation()
  }

  async getLocation() {
    this.setState({ loading: true, isRefreshing: true });
    try {
      const weather = await API.home.getWeatherList({
        device_id: 'b43bb6dc61d9fa9c', //getUniqueId(),
        weather: true,
      });
      this.setState({ loading: false, isRefreshing: false });
      if (weather.data.status != 200) {
        return
      }
      this.setState({ weather: weather.data.result });
    } catch (e) {
      this.setState({ loading: false, isRefreshing: false });
      console.log(e)
    }
  }

  render() {
    const { weather, loading, isRefreshing } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header navigation={navigation} color={'transparent'} title='Quản lý địa điểm' />
        <View style={{ width: '100%' }}>
          <TouchableOpacity onPress={() => {
            NavigationService.navigate('LocationScreen', {})
          }}>
            <View style={{ alignItems: 'center', height: 40, margin: 15, borderRadius: 40, backgroundColor: '#DFECFF', flexDirection: 'row' }}>
              <Image
                style={{ height: 35, width: 35 }}
                source={require('../../assets/images/ic_humidity_one.png')}
              />
              <Text>
                {'Nhập vị trí cần tìm kiếm'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={weather}
            renderItem={({ item, index }) => (
              <CELL title={item} onPress={() => console.log('sád')} />
            )}
            keyExtractor={(item, index) => index}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => this.getLocation()}
              />
            }
          />
        </View>
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
