import React, { Component } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import LocationView from './LocationView'
import _ from 'lodash';

export default class location extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { navigation, navigation: { state: { params: { onReload } } } } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <LocationView
          apiKey={"AIzaSyBXBWoCCozdvmjRABdP_VfDiPAsSU1WS2Q"}
          initialLocation={{
            latitude: 21.028511,
            longitude: 105.804817,
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
