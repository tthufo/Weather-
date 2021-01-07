import React, { Component } from 'react';
import { Text, Dimensions } from 'react-native';
import { View } from 'native-base';

const { width, height } = Dimensions.get('window');

export default class heading extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: props.text,
    }
    this.didChangeText = this.didChangeText.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this, this.didChangeText);
    }
  }

  didChangeText(address) {
    this.setState({ address })
  }

  render() {
    const { address } = this.state;
    return (
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center', maxWidth: width - 120 }}>
        {address}
      </Text>
    );
  }
}