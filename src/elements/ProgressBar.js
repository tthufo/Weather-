import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default class ProgressBar extends Component {
  render() {
    const { percentage } = this.props;
    return (
      <View style={{ height: 6, width: width, flexDirection: 'row', backgroundColor: '#d8d8d8' }}>
        <View style={{ height: 6, width: (width * percentage), backgroundColor: '#f39c12' }}>

        </View>
      </View>
    );
  }
}