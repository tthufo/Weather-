import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Dimensions, ScrollView,
} from 'react-native';
import { Container, Text } from 'native-base';
import { Header } from '../elements';
import WeatherHeader from '../elements/WeatherHead';
import TopTab from './toptab';
import Hour24 from './24h';
import Day7 from './7d';
import _ from 'lodash';

const os = Platform.OS;

const numColumns = 7;
const size = (Dimensions.get('window').width / numColumns);

const COLOR = ['#4B8266', '#FAECDF']
const COLOR1 = ['#FAECDF', '#4B8266']
const CC = ['white', '#4B8266']
const CC1 = ['#4B8266', 'white']

export default class weather extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Thời tiết'} />

        <View style={{ flexDirection: 'column', flex: 1 }}>

          <WeatherHeader delay={1500} />
          <TopTab />

        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginTop: 30,
    width: 90,
    alignSelf: 'flex-end',
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  itemContainer: {
    width: size,
    height: size + 10,
  },
  item: {
    flex: 1,
    margin: 3,
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
  innerContainer: {
    alignItems: 'center',
    width: 363,
    height: os === 'ios' ? 200 : 270,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#979797"
  },
  regularText: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 24,
  }
});
