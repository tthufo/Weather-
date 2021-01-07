import React, { Component } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Text } from 'native-base';
import { Header } from '../elements';
import { weatherImage } from '../Utils/helper';
import _ from 'lodash';

const { width, height } = Dimensions.get('window');

const os = Platform.OS;

const numColumns = 4;
const size = (width - 30) / numColumns;
const widthSize = width / 1;

function Winding(deg) {
  if (deg == null) return { 'direction': "-", 'icon': require('../../assets/images/bg_blur.png') };
  else if (deg >= 11.25 && deg < 33.75) return { 'direction': "BĐB", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 33.75 && deg < 56.25) return { 'direction': "ĐB", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 56.25 && deg < 78.75) return { 'direction': "ĐĐB", 'icon': require('../../assets/images/NE.png') };
  else if (deg >= 78.75 && deg < 101.25) return { 'direction': "Đ", 'icon': require('../../assets/images/E.png') };
  else if (deg >= 101.25 && deg < 123.75) return { 'direction': "ĐĐN", 'icon': require('../../assets/images/SE.png') };
  else if (deg >= 123.75 && deg < 146.25) return { 'direction': "ĐN", 'icon': require('../../assets/images/SE.png') };
  else if (deg >= 146.25 && deg < 168.75) return { 'direction': "NĐN", 'icon': require('../../assets/images/SE.png') };
  else if (deg >= 168.75 && deg < 191.25) return { 'direction': "N", 'icon': require('../../assets/images/S.png') };
  else if (deg >= 191.25 && deg < 213.75) return { 'direction': "NTN", 'icon': require('../../assets/images/SW.png') };
  else if (deg >= 213.75 && deg < 236.25) return { 'direction': "TN", 'icon': require('../../assets/images/SW.png') };
  else if (deg >= 236.25 && deg < 258.75) return { 'direction': "TTN", 'icon': require('../../assets/images/SW.png') };
  else if (deg >= 258.75 && deg < 281.25) return { 'direction': "T", 'icon': require('../../assets/images/W.png') };
  else if (deg >= 281.25 && deg < 303.75) return { 'direction': "TTB", 'icon': require('../../assets/images/NW.png') };
  else if (deg >= 303.75 && deg < 326.25) return { 'direction': "TB", 'icon': require('../../assets/images/NW.png') };
  else if (deg >= 326.25 && deg < 348.75) return { 'direction': "BTB", 'icon': require('../../assets/images/NW.png') };
  else if (deg >= 348.75 || deg < 11.25) return { 'direction': "B", 'icon': require('../../assets/images/N.png') };
  else return { 'direction': "-", 'icon': require('../../assets/images/bg_blur.png') };
}

const CELL = ({ item, index }) => {
  return (
    <View style={{ marginLeft: 15, marginRight: 15 }}>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          height: 60,
        }}>
        <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, marginBottom: 5 }}>{item.timer}</Text>
          <Text style={{ fontSize: 14, marginBottom: 5 }}>{item.day}</Text>
        </View>
        <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ height: 30, width: 30, marginTop: -10 }}
              source={weatherImage(Math.round(item.weather) - 1)}
            />
            <Text style={{ fontSize: 14 }}>{item.temperature}°</Text>
          </View>
          <Text style={{ fontSize: 12 }}>Cảm nhận {item.temperature_feeling}°</Text>
        </View>
        <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14 }}>{`${item.winding} ${item.wind_unit}`}</Text>
          <View style={{ flexDirection: 'row', marginTop: 2 }}>
            <Image
              style={{ height: 12, width: 12, resizeMode: 'contain', marginTop: 2 }}
              source={Winding(item.wind_direction).icon}
            />
            <Text style={{ fontSize: 12, textAlign: 'center' }}>{Winding(item.wind_direction).direction || ''}</Text>
          </View>
        </View>
        <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14 }}>{Math.round(item.probability_rain)}%</Text>
          <Text style={{ fontSize: 14 }}>--</Text>
        </View>
      </View>
      <View style={{ height: 0.5, width: widthSize, backgroundColor: 'black' }} />
    </View>
  );
};

export default class main24hdetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weather: [],
      loading: false,
      isRefreshing: false,
    };
  }

  render() {
    const { navigation, navigation: { state: { params: { weatherData, locationName } } } } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header navigation={navigation} color={'transparent'} title={locationName} />

        <View style={{
          borderRadius: 22, marginRight: 15, marginLeft: 15, marginBottom: 15,
          flexDirection: 'row', justifyContent: 'space-between',
          height: 40, backgroundColor: '#DFECFF'
        }}>
          <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../assets/images/ico_time.png')}
            />
          </View>
          <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../assets/images/ico_degree.png')}
            />
          </View>
          <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../assets/images/ico_wind.png')}
            />
          </View>
          <View style={{ width: size, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../assets/images/ico_rain.png')}
            />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={weatherData}
            renderItem={({ item, index }) => (
              <CELL item={item} index={index} />
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
