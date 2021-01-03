import React, { Component } from 'react';
import { StyleSheet, Dimensions, Alert, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator, ScrollView, View, Image } from 'react-native';
import { Container, Button, Text } from 'native-base';
import Input from '../elements/Input/styled';
import validate, { alert_validation } from '../elements/Input/validators';
import validation_string from '../elements/Input/string';
import { Header } from '../elements';
import Toast from 'react-native-simple-toast';
import API from '../apis';
import _ from 'lodash';

const validations = {
  phone: {
    label: 'OTP',
    max: 10,
    required: true,
  },
  password: {
    label: "Password",
    required: true,
    min: 4,
    max: 16,
  },
};

export default class reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register_info: {
        company_name: false,
        name: false,
        email: false,
        phone: false,
        invitation_code: null,
        password: false,
        password_confirmation: false,
        check: false,
      },
      loading: false,
      isConnected: true
    };
    this.didUpdateData = this.didUpdateData.bind(this);
    this.password_confirmation = this.password_confirmation.bind(this);
    this.didPressSubmit = _.debounce(this.didPressSubmit, 2000, { leading: true, trailing: false });
  }

  async didSubmit() {
    const { register_info: { phone, password } } = this.state;
    const { navigation: { state: { params: { phoneNumber } } } } = this.props;
    this.setState({ loading: true })
    try {
      const result = await API.auth.reset({
        msisdn: phoneNumber,
        otp: phone,
        password,
      })
      this.setState({ loading: false })
      if (result.data.statusCode != 200) {
        const message = result.data && result.data.data && result.data.data.message || 'Lỗi xảy ra, mời bạn thử lại'
        Toast.show(message)
        return
      }
      Toast.show(result.data && result.data.data && result.data.data.message || '')
      this.props.navigation.popToTop();
    } catch (e) {
      console.log(e);
      this.setState({ loading: false })
    }
  }

  render() {
    const { navigation } = this.props;
    const { show_validation, register_info, loading } = this.state;
    const { navigation: { state: { params: { phoneNumber } } } } = this.props;
    return (
      <Container>
        <Header navigation={navigation} title={'Đặt lại mật khẩu'} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{}}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{ width: 120, height: 120, marginTop: 50 }}
                source={require('../../assets/images/logo.png')}
              />
            </View>
            <Text style={{ marginLeft: 15, marginTop: 15, color: '#4B8266', fontWeight: 'bold', fontSize: 24 }}>{'Đặt lại mật khẩu'}</Text>
            <Text style={{ margin: 15, fontWeight: 'normal', fontSize: 15, textAlign: 'center' }}>
              {`Để đặt lại mật khẩu, Quý khách vui lòng nhập mã đã gửi tới số ${phoneNumber} để xác thực`}
            </Text>
            <Input
              testID="phone_textfield" label={'Mã xác thực*'} keyboardType='numeric' parent={this} group="register_info" linkedkey="phone" validation={validations.phone} showValidation={show_validation}
              value={register_info.phone}
              typeSet
              textContentType="oneTimeCode"
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    phone: text
                  }
                })
              }}
            />
            <Input
              testID="password_textfield" label={'Mật khẩu *'} parent={this} group="register_info" linkedkey="password" secureTextEntry unhidden validation={validations.password} showValidation={show_validation}
              value={register_info.password}
              typeSet
              textContentType="oneTimeCode"
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    password: text.length > 0 ? text : false
                  }
                })
              }}
            />
            <Input
              testID="confirm_password_textfield" label={'Nhập lại mật khẩu *'} parent={this} group="register_info" linkedkey="password_confirmation" secureTextEntry unhidden validation={() => this.password_confirmation()} showValidation={show_validation}
              value={register_info.password_confirmation}
              typeSet
              textContentType="oneTimeCode"
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    password_confirmation: text.length > 0 ? text : false
                  }
                })
              }}
            />
            {loading ?
              <ActivityIndicator size="large" color="#00A7DC" style={{ marginTop: 15 }} />
              :
              <Button testID="BTN_SIGN_IN" block primary style={styles.btn_sign_in} onPress={() => this.didPressSubmit()}>
                <Text style={styles.regularText}>{'Đặt lại'}</Text>
              </Button>}
            {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity testID="register_button" style={styles.btn_register} onPress={() => this.didGetOTP()}>
                <Text style={{ color: 'black' }}>{'Bạn chưa nhận được mã ?'}</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="register_button" style={styles.btn_register} onPress={() => this.didGetOTP()}>
                <Text style={{ color: '#4B8266' }}>{'Lấy lại'}</Text>
              </TouchableOpacity>
            </View> */}
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    );
  }

  password_confirmation() {
    if (this.state.register_info.password === this.state.register_info.password_confirmation) {
      return true;
    } else {
      return validation_string.default('Mật khẩu không trùng khớp');
    }
  }

  keyboardUpdate(frames) {
    this.setState({ ...this.state, frames });
  }

  async didPressSubmit() {
    if (!this.state.isConnected) {
      return;
    }
    this.setState({ ...this.state, show_validation: true });
    const validation_results = validate(this.state.register_info, validations);
    if (this.state.register_info.password !== this.state.register_info.password_confirmation) {
      validation_results.push('Mật khẩu không trùng khớp');
    }
    if (validation_results.length > 0) {
      alert_validation(validation_results);
    } else {
      this.didSubmit()
    }
  }

  didUpdateData(key, data) {
    this.setState({ ...this.state, [key]: data });
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginTop: 50,
    marginRight: 50,
    marginLeft: 30,
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  bottom_text: {
    marginTop: 24,
    marginLeft: 13,
    marginBottom: 20,
    marginRight: 13,
    textAlign: 'center',
    lineHeight: 22
  },
  btn_register: {
    margin: 10,
  },
  bottom_text1: {
    marginLeft: 13,
    marginRight: 13,
    textAlign: 'center',
    lineHeight: 22,
  },
  invitation_code: {
    color: 'black',
    marginLeft: 13,
    marginRight: 13,
    marginTop: 5,
  }
});

