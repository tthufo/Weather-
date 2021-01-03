import React, { Component } from 'react';
import { StyleSheet, Alert, KeyboardAvoidingView, ScrollView, View, Image } from 'react-native';
import { Container, Button, Text } from 'native-base';
import Input from '../elements/Input/styled';
import validate, { alert_validation, validPhone } from '../elements/Input/validators';
import validation_string from '../elements/Input/string';
import { Header } from '../elements';
import API from '../apis';
import NavigationService from '../../service/navigate';
import _ from 'lodash';

const validations = {
  phone: {
    label: 'Phone',
    min: 10,
    max: 11,
    required: true,
  }
};

export default class forgot extends Component {
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
        check: false,
      },
      frames: false,
      isConnected: true
    };
    this.didUpdateData = this.didUpdateData.bind(this);
    this.didPressSubmit = _.debounce(this.didPressSubmit, 2000, { leading: true, trailing: false });
  }

  async didSubmit() {
    const { register_info: { phone } } = this.state;
    this.setState({ loading: true })
    try {
      const result = await API.auth.forgot({
        msisdn: validPhone(phone),
      })
      this.setState({ loading: false })
      if (result.data.statusCode != 200) {
        const message = result.data && result.data.data && result.data.data.message || 'Lỗi xảy ra, mời bạn thử lại'
        Toast.show(message)
        return
      }
      NavigationService.navigate('Reset', { phoneNumber: validPhone(phone) })
    } catch (e) {
      console.log(e);
      this.setState({ loading: false })
    }
  }

  render() {
    const { navigation } = this.props;
    const { show_validation, register_info, check } = this.state;
    return (
      <Container>
        <Header navigation={navigation} title={'Quên mật khẩu'} />
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
            <Text style={{ marginLeft: 15, marginTop: 15, color: '#4B8266', fontWeight: 'bold', fontSize: 24 }}>Quên mật khẩu</Text>
            <Input
              testID="phone_textfield" label={'Số điện thoại *'} keyboardType='numeric' parent={this} group="register_info" linkedkey="phone" validation={validations.phone} showValidation={show_validation}
              value={register_info.phone}
              typeSet
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    phone: text
                  }
                })
              }}
            />
            <Button testID="BTN_SIGN_IN" block primary style={styles.btn_sign_in} onPress={() => this.didPressSubmit()}>
              <Text style={styles.regularText}>{'Gửi lại mật khẩu qua SMS'}</Text>
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    );
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
    if (validation_results.length > 0) {
      alert_validation(validation_results);
    } else {
      this.didSubmit();
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

