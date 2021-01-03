import React, { Component } from 'react';
import { Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import string from './string';
import { Platform, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import constant from '../../Config/Constant';
const os = Platform.OS;

export default class index extends Component {

  render() {
    const { title } = this.props;
    return (
      <View style={{ flexDirection: 'row', height: constant.headerHeight, backgroundColor: '#0aa2dd', paddingHorizontal: 10 }}>
        {this.renderLeft()}
        <Body style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.bodyTitle}>{title}</Text>
          </View>
        </Body>
        {this.renderRight()}
      </View>
    )
  }

  renderRight() {
    if (this.props.renderRight) {
      return this.props.renderRight();
    } else if (this.props.rightText) {
      return (
        <Right style={{ flex: 1 }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#ffffff' }}>{this.props.rightText}</Text>
          </View>
        </Right>
      );
    } else if (this.props.rightAttachFile) {
      return (
        <Right style={{ flex: 1 }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={this.props.onAttachFile}>
              {/* <Image style={{ width: 35, height: 35 }} source={require('../../../assets/images/ic_attach_file.png')} /> */}
            </TouchableOpacity>
          </View>
        </Right>
      );
    } else if (this.props.rightDownloadFile) {
      return (
        <Right style={{ flex: 1 }} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={this.props.onDownloadFile}>
              {/* <Image style={{ width: 35, height: 35 }} source={require('../../../assets/images/ic_download.png')} /> */}
            </TouchableOpacity>
          </View>
        </Right>
      );
    } else {
      return <Right style={{ flex: 1 }} />
    }
  }

  renderLeft() {
    if (this.props.navigation) {
      return (
        <Left style={{ flex: 1 }}>
          <TouchableOpacity testID={`BTN_BACK`} onPress={this.props.isWalkThough == true ? () => this.props.navigation.pop(2) : () => {
            this.props.navigation.goBack()
            if (this.props.handleWhenBack) this.props.handleWhenBack()
          }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 12, height: 21, marginRight: 5 }}
                source={require('../../../assets/images/arrow_left_white.png')}
              />
              <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>{string.back}</Text>
            </View>
          </TouchableOpacity>
        </Left>
      )
    }
    else {
      return <Left style={{ flex: 1 }} />
    }
  }
};

const styles = StyleSheet.create({
  bodyTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})