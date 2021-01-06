import React, { Component } from 'react';
import {
  View, StyleSheet, NativeModules, Dimensions, Platform,
} from 'react-native';
import { Text } from 'native-base';
import _ from 'lodash';

const { width } = Dimensions.get('window');
const sizeWidth = width - 100;

export default class address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
    };
  }

  componentDidMount() {
    if (Platform.OS == "ios") {
      this.getWeather();
    }
  }

  getWeather() {
    const { latLong } = this.props;
    if (latLong) {
      NativeModules.Permission.getAddress({ lat: latLong && latLong.lat || 0, long: latLong && latLong.long || 0 }, (ind) => {
        this.setState({ address: ind || '' })
      })
    }
  }

  render() {
    const { full } = this.props;
    const { address } = this.state;
    return (
      <View style={{ width: full ? sizeWidth : 'auto' }}>
        <Text style={this.props.style}>{address}</Text>
      </View >
    );
  }
}

const styles = StyleSheet.create({

});
