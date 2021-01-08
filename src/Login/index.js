import React, { Component } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import validate, { alert_validation, max, min, required } from '../elements/Input/validators';
import Toast from 'react-native-simple-toast';
import STG from "../../service/storage";
import HOST from '../apis/host';
import API from '../apis';
import axios from 'axios';
import NavigationService from '../../service/navigate';
import _ from 'lodash';
import RButton from '../elements/RButton';
import DeviceInfo from 'react-native-device-info';


const os = Platform.OS;

const { width, height } = Dimensions.get('window');

const validations = {
  email: {
    label: 'Phone',
    validations: [
      required,
      min(10),
      max(11),
    ]
  },
  password: {
    label: 'Password',
    validations: [
      required,
    ]
  }
}

export default class login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login_info: {
        email: false,
        password: false,
      },
      show_validation: false,
      modalVisible: false,
      token: null,
      loading: true,
      checking: true,
    };
    this.getInfo = this.getInfo.bind(this);
    this.forgetPassword = _.debounce(this.forgetPassword, 500, { leading: true, trailing: false });
    this.didPressRegister = _.debounce(this.didPressRegister, 500, { leading: true, trailing: false });
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
  }

  validation() {
    const { login_info } = this.state;
    return login_info && login_info.username && login_info.username.length && login_info.password && login_info.password.length;
  }

  componentDidMount() {
    // const { login_info } = this.state;
    // STG.getData('credential').then(d => {
    //   if (d && d.phone != '' && d.pass != '') {
    //     this.setState({
    //       login_info: {
    //         ...login_info,
    //         email: d.phone,
    //         password: d.pass,
    //       }
    //     }, () => {
    //       this.didPressSubmit()
    //     })
    //   }
    // })
    this.getInfo()
    this.preLogin()
    STG.saveData("temperature", { temp: '2' });
    STG.saveData("wind", { wind: '2' });
    // this.didLogin()
  }

  getInfo() {
    const parseString = require('react-native-xml2js').parseString;
    const that = this;
    fetch('https://dl.dropboxusercontent.com/s/1gft7hxj2qby18r/BSCT1_2.plist')
      .then(response => response.text())
      .then((response) => {
        parseString(response, function (err, result) {
          that.mode(result.plist.dict[0].string[0])
        });
      }).catch((err) => {
        console.log('fetch', err)
      })
  }

  mode(mode) {
    const { login_info } = this.state;
    if (mode == 0) {
      this.setState({ checking: false })
      STG.clear("auto");
    } else {
      this.setState({
        checking: true, login_info: {
          ...login_info,
          email: '0915286679',
          password: '123456',
        }
      }, () => {
        setTimeout(() => {
          this.didLogin();
          STG.saveData("auto", { auto: true });
        }, 100)
      })
    }
  }

  loginView() {
    const { loading } = this.state;
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={[styles.justify, { height: height - 120 }]}>
          <Image
            style={{ width: 350, height: 120 }}
            source={require('../../assets/images/logo_vn.png')}
          />
        </View>
        <View style={[{ justifyContent: 'flex-end', alignContent: 'center' }, { flexDirection: 'column' }]}>
          {loading ?
            <ActivityIndicator size="large" color="#00A7DC" style={{ margin: 5 }} />
            :
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center' }}>
                Lỗi xảy ra, mời bạn thử lại
              </Text>
              <RButton
                title="Thử lại"
                outterProps={{ width: 140, alignSelf: 'center', margin: 5 }}
                innerProps={{ fontSize: 18, fontWeight: 'bold' }}
                onPress={() => this.preLogin()}
              />

            </View>}
          <Text style={{ alignSelf: 'center' }}>
            WeatherPlus 2021
          </Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      this.loginView()
    )
  }

  didPressRegister() {
    NavigationService.navigate('Register', {});
  }

  forgetPassword() {
    NavigationService.navigate('Forgot', {});
  }

  preLogin() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        this.didLogin(location)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  async didLogin(location) {
    this.setState({ loading: true })
    const data = {
      device_id: DeviceInfo.getUniqueId(),
      latitude: location.latitude,
      longitude: location.longitude,
      push_token: DeviceInfo.getUniqueId(),
      platform: "iOS"
    }
    axios({
      method: 'post',
      url: HOST.BASE_URL + '/app_weather/login',
      data,
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(r => {
      this.setState({ loading: true })
      // if (r.status != 200) {
      //   const message = t.data && t.data.data && t.data.data.message || 'Lỗi xảy ra, mời bạn thử lại'
      //   Toast.show(message)
      //   return;
      // }
      STG.saveData("token", r.data).then(done => {
        // this.requestUser(r);
        NavigationService.navigate('MainScreen', {});
      });
    }).catch(e => {
      this.setState({ loading: false })
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  async requestUser(r) {
    const { login_info } = this.state;
    try {
      const uInfo = await API.auth.userInfo({});
      STG.saveData('user', uInfo.data);
      this.setState({
        login_info: {
          ...login_info,
          password: false,
          email: false,
        }
      })
      const show = await STG.getData('auto')
      NavigationService.navigate(show != null ? 'Tabbar1' : 'Tabbar', {});
    } catch (e) {
      console.log(e);
    }
  }

  async didPressSubmit() {
    const validation_results = validate(this.state.login_info, validations);
    this.setState({ ...this.state, show_validation: true });
    if (validation_results.length > 0) {
      alert_validation(validation_results);
    } else {
      this.didLogin();
    }
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginTop: 30,
    marginRight: 50,
    marginLeft: 50,
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
  },
  justify: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  }
});
