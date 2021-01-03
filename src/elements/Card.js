import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

export default class Card extends Component {
  render() {

    const addition_style = {};
    if (this.props.first) {
      addition_style.marginTop = 24;
    }
    if (this.props.last) {
      addition_style.marginBottom = 24;
    }
    return (
      <View style={[ styles.card, addition_style, this.props.style ]}>
        { this.props.children }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(137, 137, 137, 0.5)",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 16,
    shadowOpacity: 1
  }
});