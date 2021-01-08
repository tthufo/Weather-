import React, { Component } from 'react';
import { Text, Dimensions } from 'react-native';
import { View } from 'native-base';
import IC from '../elements/icon';

const { width, height } = Dimensions.get('window');

export default class heading extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
    }
    this.didChangeData = this.didChangeData.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this, this.didChangeData);
    }
  }

  didChangeData(data) {
    this.setState({ data })
  }

  render() {
    const { data } = this.state;
    const ready = Object.keys(data).length != 0
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <View>
        <View style={{ backgroundColor: 'transparent', flex: 1, padding: 5, flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ fontSize: 60, color: 'white' }}>{ready && data.temperature || '-'}</Text>
          <Text style={{ fontSize: 30, color: 'white' }}>{ready && data.temp_unit}</Text>
        </View>
        <View style={{ backgroundColor: 'transparent', flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold', marginBottom: 10 }}>{ready && ICON[Math.round(data.weather) - 1].name || '-'}</Text>
          <Text style={{ fontSize: 16, color: 'white' }}>{`Cảm nhận ${ready && data.temperature_feeling || '-'}${ready && data.temp_unit || ''}`} </Text>
        </View>
      </View>
    );
  }
}