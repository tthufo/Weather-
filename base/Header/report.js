import React, { Component } from 'react';
import { StyleSheet, Image, Platform, TouchableOpacity, View, Text, Alert } from 'react-native';
import { Header, Left, Body, Right, Button } from 'native-base';
import Images from '../../../assets';
import { Label } from '../index';
import string from "./string";
import moment from 'moment';
import Constants from '../../Config/Constant';
import { EventRegister } from 'react-native-event-listeners'

const os = Platform.OS;

export default class index extends Component {
  render() {
    const { navigation, title, current, total, onBack, lastUpdate, onPressRightButton, noSubHeader, isExtraList, isAddExtraList, refeshing, checkRequired } = this.props;
    return (
      <Header style={styles.header}>
        <Left style={{ flex: 1 }}>
          {!isAddExtraList && <TouchableOpacity
            onPress={() => {
              onBack && onBack();
              if (this.props.dontBack) {
                EventRegister.emit(Constants.backReport, isExtraList)
              } else {
                if (checkRequired && checkRequired != '') {
                  Alert.alert('', checkRequired)
                  return
                }
                navigation.goBack();
              }
            }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 12, height: 21, marginRight: 3 }}
                source={require('../../../assets/images/arrow_left_white.png')}
              />
              <Text style={{ fontSize: 15, fontSize: 17, color: '#ffffff', fontWeight: 'bold' }}>{string.back}</Text>
            </View>
          </TouchableOpacity>
          }
        </Left>
        <Body style={{ flex: 3 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ color: '#ffffff', fontSize: 17, fontWeight: 'bold' }}>{title}</Text>
            {noSubHeader || isExtraList ? null : <Label style={styles.label_small}>{current}/{total}</Label>}
          </View>
        </Body>
        <Right style={{ flex: 1 }} >
          {onPressRightButton && !isExtraList && (
            <Button transparent onPress={onPressRightButton}>
              <Image style={{ width: 30, height: 30, marginTop: 5 }} source={refeshing ? Images.generalScreen.icRefresh : Images.generalScreen.icMoreOutLine} />
            </Button>
          )}
        </Right>
      </Header>
    )
  }
};

const renderLastUpdate = (lastUpdate) => {
  const duration = moment().diff(moment(lastUpdate), 'seconds');
  const minutes = Math.round(duration / 60);
  const hours = Math.round(duration / 3600);
  const days = Math.round(duration / 86400);
  const weeks = Math.round(duration / 604800);
  const months = Math.round(duration / 2629440);
  const years = Math.round(duration / 31553280);
  if (duration <= 60) {
    return "1分前"
  } else if (minutes <= 60) {
    return `${minutes}分前`
  } else if (hours <= 24) {
    return `${hours}時間前`
  } else if (days <= 7) {
    return `${days}日前`
  } else if (weeks <= 4.3) {
    return `${weeks}週間前`
  } else if (months <= 12) {
    return `${months}ヶ月前`
  } else {
    return `${years}年前`
  }
}

const styles = StyleSheet.create({
  label: {
    color: '#ffffff',
    marginBottom: 7,
    // fontFamily: 'SourceHanSansHW-Regular'
  },
  label_small: {
    color: '#ffffff',
    // fontFamily: 'SourceHanSansHW-Regular',
    lineHeight: 22
  },
  header: {
    height: os === 'ios' ? 80 : 65,
  }
});
