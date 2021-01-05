import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, SafeAreaView } from 'react-native';
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
import { getUniqueId } from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

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

export default class locationlist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weather: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getLocation()
  }

  async getLocation() {
    this.setState({ loading: true });
    try {
      const weather = await API.home.getWeatherList({
        device_id: getUniqueId(),
        weather: null,
      });
      this.setState({ loading: false });
      if (weather.data.status != 200) {
        return
      }
      this.setState({ weather: weather.data.result });
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  render() {
    const { weather, loading } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header navigation={navigation} color={'transparent'} title='Quản lý địa điểm' />
        <View style={{ flex: 1, width: '100%' }}>
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
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 150,
                  }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{'33'}</Text>
                  <Image
                    style={{ height: 30, width: 30, marginTop: 20 }}
                    source={require('../../assets/images/ic_humidity_one.png')}
                  />

                  <Image
                    style={{ height: 20, width: 20 }}
                    source={require('../../assets/images/ic_humidity_one.png')}
                  />

                  <Text style={{ fontWeight: 'bold', fontSize: 14 }}>%</Text>

                </View>
              </View>
            )}
            keyExtractor={(item, index) => index}
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
