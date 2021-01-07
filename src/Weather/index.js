import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import STG from '../../service/storage';
import API from '../apis';
import HOST from '../apis/host';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import IC from '../elements/icon';
import _ from 'lodash';
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
      latLong: null,
    };
  }

  componentDidMount() {

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState != this.props;
  }

  render() {
    const { crops, selectedCrop, weather, loading } = this.state;
    const { latitude, longitude, location_name } = this.props;
    const resultGmos = weather.resultGmos && weather.resultGmos[0]
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <Container style={{ backgroundColor: 'transparent' }}>
        <Content
          style={{ backgroundColor: 'transparent' }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              // onRefresh={}
              tintColor="white"
            />}
        >
          <View style={{ backgroundColor: 'transparent', flex: 1, padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
            {loading ? <ActivityIndicator size="large" color="white" />
              :
              <TouchableOpacity onPress={() => {
                this.getLocation();
              }}>
                <Image
                  style={{ width: 70, height: 70, marginRight: 5 }}
                  source={resultGmos && ICON[Math.round(resultGmos.weather) - 1].icon || ''}
                />
              </TouchableOpacity>}
            <Text style={{ fontSize: 60, color: 'white' }}>{resultGmos && Math.round(resultGmos.air_temperature) || '--'}</Text>
            <Text style={{ fontSize: 30, color: 'white' }}>°C</Text>
          </View>
          <View style={{ backgroundColor: 'transparent', flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, color: 'white' }}>{`Nhiệt độ cảm nhận ${resultGmos && Math.round(resultGmos.temperatureFeel).toString() || '--'}°C`} </Text>
            <Text style={{ fontSize: 17, color: 'white' }}>{resultGmos && ICON[Math.round(resultGmos.weather) - 1].name || '--'}</Text>
          </View>

          <Weather24 locationName={location_name} latLong={{ lat: latitude, lng: longitude }} />

          <TouchableOpacity>
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
