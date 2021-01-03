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
import {
  PageControlAji,
} from 'react-native-chi-page-control';
import Weather from '../Weather';
import TopTab from './toptab';

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

const COLOR = ["#DFEEB6", "#E9DEB3", "#F1D4B7", "#DCE5CB", "#DFEEB6", "#E9DEB3", "#F1D4B7", "#DCE5CB"]

export default class main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login_info: {
        email: false,
        password: false
      },
      show_validation: false,
      modalVisible: false,
      token: null,
      isConnected: true,
      crops: [],
      selectedCrop: 0,
      weather: {},
      loading: true,
      latLong: null,
      page: 0,
    };
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };


  componentDidMount() {
    setTimeout(() => {
      this.getLocation();
    }, 500)
    STG.getData('user').then(u => {
      this.getCrops(u.subscribe);
    })
  }

  getLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        this.getWeather(location);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  async getWeather(location) {
    this.setState({ loading: true });
    this.setState({ latLong: { lat: location.latitude, long: location.longitude } })
    try {
      const show = STG.getData('auto')
      const weather = await API.home.getWeather({
        latitude: show ? 21.028511 : location.latitude,
        longtitude: show ? 105.804817 : location.longitude,
        type: 1,
      });
      this.setState({ loading: false });
      if (weather.data.statusCode != 200) {
        return
      }
      this.setState({ weather: weather.data.data });
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  async getCrops(subscriber) {
    var bodyFormData = new FormData();
    const show = await STG.getData('auto')
    const userInfo = await STG.getData('token')
    bodyFormData.append('subscriber', subscriber);
    axios({
      method: 'post',
      url: HOST.BASE_URL + '/appcontent/cropsUser/list-crops-user',
      data: bodyFormData,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Authorization': 'bearer ' + userInfo.access_token,
      }
    }).then(r => {
      if (r.status != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return;
      }
      const resign = r.data.data.filter(e => show ? (e.cropsUserId != null && e.cropsId != 27 && e.cropsId != 28) : e.cropsUserId != null).map((e, index) => {
        e.check = index == 0 ? true : false;
        return e;
      });
      this.setState({
        crops: resign.filter(e => e.cropsUserId != null),
      })
    }).catch(e => {
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  handleChange = (index) => {
    var newData = [...this.state.crops];
    newData.map(e => {
      e.check = false
    })
    newData[index].check = true;
    this.setState({ crops: newData, selectedCrop: index });
  };

  reload() {
    STG.getData('user').then(u => {
      this.setState({ selectedCrop: 0 }, () => {
        this.getCrops(u.subscribe);
      })
    })
  }

  onScrollEnd(e, length) {
    this.setState({ page: e.nativeEvent.contentOffset.x / ((length - 1) * width) })
  }

  render() {
    const { crops, selectedCrop, weather, loading, latLong, page } = this.state;
    const resultGmos = weather.resultGmos && weather.resultGmos[0]
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopTab />
        {/* <PageControlAji style={{ alignItems: 'center', width: width }} progress={page} numberOfPages={3} />
        <FlatList
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal
          pagingEnabled
          onScroll={(e) => this.onScrollEnd(e, 3)}
          data={['', '', '',]}
          renderItem={({ item }) => (
            <View style={{ width: width, height: height }}>
              <Weather />
            </View>
          )}
          numColumns={1}
          keyExtractor={(item, index) => index}
        /> */}
        <Button onPress={() => NavigationService.jumping('2')} >
          <Text>sdfds</Text>
        </Button>
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
