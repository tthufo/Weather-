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
import LocationView from './LocationView'
import _ from 'lodash';

export default class location extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { navigation, navigation: { state: { params: { onReload } } } } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <LocationView
          apiKey={"AIzaSyBXBWoCCozdvmjRABdP_VfDiPAsSU1WS2Q"}
          initialLocation={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          onReload={onReload}
          navigation={navigation}
        />
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
