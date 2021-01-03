import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
// import { BarIndicator } from 'react-native-indicators';

export default class index extends Component {
  render() {
    return (
      <View style={{ height: 55, justifyContent: 'center' }}>
        <ActivityIndicator color="#00A7DC" size="large" />
      </View>
    );
  }
}