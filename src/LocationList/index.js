import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { Text } from 'native-base';
import API from '../apis';
import { Header } from '../elements';
import IC from '../elements/icon';
import NavigationService from '../../service/navigate';
import { temperature, weatherImage } from '../Utils/helper';
import Swipeout from 'react-native-swipeout';
import _ from 'lodash';

const { width, height } = Dimensions.get('window');

const CELL = ({ data, onPress }) => {
  return (
    <TouchableOpacity style={{ flex: 1, marginRight: 15, marginLeft: 15, marginBottom: 10 }} onPress={onPress}>
      <View style={{ paddingTop: 15, paddingBottom: 15, flex: 1, backgroundColor: '#4B8266', flexDirection: 'row', alignItems: 'center', borderRadius: 15, padding: 5 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ marginLeft: 8, flex: 1, fontSize: 18, color: 'white', flexWrap: 'wrap', fontWeight: 'bold', marginBottom: 5 }}>
            {data.location_name && data.location_name.split('-')[0] || ''}
          </Text>
          <Text style={{ marginLeft: 8, flex: 1, fontSize: 17, color: 'white', flexWrap: 'wrap' }}>
            {data.location_name && data.location_name.split('-')[1] || ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', minWidth: 80, alignItems: 'center' }}>
          <Image
            style={{ height: 35, width: 35 }}
            source={weatherImage(Math.round(data.weather.weather) - 1)}
          />
          <Text style={{ textAlign: 'center', fontSize: 20, color: 'white', flexWrap: 'wrap', fontWeight: 'bold' }}>
            {data.temperature && Math.round(data.temperature)} °
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
      isEdited: false,
    };

    this.onReloadData = this.onReloadData.bind(this)
  }

  componentDidMount() {
    this.getLocation()
  }

  componentWillUnmount() {
    // const { navigation: { state: { params: { onReload } } } } = this.props;
    // if (this.state.isEdited) {
    //   if (onReload) {
    //     onReload()
    //   }
    // }
  }

  onReloadData() {
    const { navigation: { state: { params: { onReload } } } } = this.props;
    this.setState({ isEdited: true });
    if (onReload) {
      onReload()
    }
    this.getLocation()
  }

  async deleteLocation(location_ids) {
    this.setState({ loading: true, isRefreshing: true });
    const { navigation: { state: { params: { onReload } } } } = this.props;
    try {
      const weather = await API.home.deleteWeather({
        location_ids
      });
      this.setState({ loading: false, isRefreshing: false, isEdited: false });
      if (weather.data.status != 200) {
        return
      }
      this.setState({ isEdited: true });
      this.getLocation()
      if (this.state.isEdited) {
        if (onReload) {
          onReload()
        }
      }
    } catch (e) {
      this.setState({ loading: false, isRefreshing: false, isEdited: false });
      console.log(e)
    }
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
      weather.data.result.map(e => {
        (async () => {
          e['temperature'] = await temperature(e.weather.air_temperature)
        })()
      })
      setTimeout(() => {
        this.setState({ weather: weather.data.result.reverse() });
      }, 500)
    } catch (e) {
      this.setState({ loading: false, isRefreshing: false });
      console.log(e)
    }
  }

  render() {
    const { weather, loading, isRefreshing } = this.state;
    const { navigation, navigation: { state: { params: { onChangeTab } } } } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header navigation={navigation} color={'transparent'} title='Quản lý địa điểm' />
        <View style={{ width: '100%' }}>
          <TouchableOpacity onPress={() => {
            NavigationService.navigate('LocationScreen', { onReload: () => this.onReloadData() })
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
              <Swipeout sensitivity={30} close backgroundColor={'transparent'} autoClose={true} right={[{
                text: 'Xóa',
                color: '#3629EF',
                backgroundColor: 'transparent',
                onPress: () => setTimeout(() => this.deleteLocation(item.location_id), 500),
              }]}>
                <CELL data={item} onPress={() => {
                  navigation.pop()
                  if (onChangeTab) {
                    onChangeTab(String(item.location_id))
                  }
                }} />
              </Swipeout>
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
