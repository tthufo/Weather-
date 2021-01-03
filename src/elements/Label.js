import React, { Component } from 'react';
import { Text } from 'react-native';

export default class index extends Component {
  render() {
    const { blue, dark, style, lg, xl, sm, xs, gray, bold, xxl } = this.props;
    const applied_style = {
      // fontFamily: "SourceHanSansHW-Regular",
      fontSize: 15,
      fontWeight: "500",
      fontStyle: "normal",
      letterSpacing: 0,
      color: '#172b4d'
    };
    if (lg) {
      applied_style.fontSize = 17;
    }
    if (xl) {
      applied_style.fontSize = 19;
    }
    if (xxl) {
      applied_style.fontSize = 24;
    }
    if (sm) {
      applied_style.fontSize = 13;
    }

    if (xs) {
      applied_style.fontSize = 12;
    }

    if (blue) {
      applied_style.color = '#0aa2dd';
    }
    if (gray) {
      applied_style.color = '#505f79';
    }
    if (bold) {
      applied_style.fontWeight = 'bold';
    }
    return (
      <Text {...this.props} style={[applied_style, style]}>
        { this.props.children}
      </Text>
    );
  }
}