import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions, Platform, View, Text } from 'react-native';
import { Header, Item } from 'native-base';
import TextInput from '../../elements/Input/CustomTextInput';
import _ from 'lodash';
import string from './string';
import constant from '../../Config/Constant';

const { width, height } = Dimensions.get('window');

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      isPress: false
    }
    this.onPressCalendar = _.debounce(this.onPressCalendar, 500, { leading: true, trailing: false });
  }

  onPressCalendar() {

  }

  render() {
    const { onSubmitEditing, navigation: { navigate } } = this.props;
    return (
      <View style={{ backgroundColor: '#0aa2dd', height: constant.searchHeight, flexDirection: 'row' }}>
        {/* <Header style={styles.header_bar}> */}
        <Item style={styles.search_item}>
          {/* <Image source={require('../../../assets/images/search_header_blue.png')} style={{ marginLeft: 9 }} /> */}
          <TextInput
            placeholder={string.search}
            style={styles.text_input}
            underlineColorAndroid="transparent"
            returnKeyType="search"
            onChangeText={(text) => {
              this.setState({
                ...this.state,
                keyword: text
              }, () => {
                if (this.state.keyword.length === 0) {
                  onSubmitEditing(this.state.keyword)
                }
              })
            }}
            onSubmitEditing={() => !!onSubmitEditing ? onSubmitEditing(this.state.keyword) : () => { }}
          />
        </Item>
        <TouchableOpacity
          testID="header_calendar_button"
          transparent
          style={styles.icon}
          onPress={() => this.onPressCalendar()}
        >
          {/* <Image source={require('../../../assets/images/calendar_white.png')} /> */}
        </TouchableOpacity>
        {/* </Header> */}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  header_bar: {
    ...Platform.select({
      ios: {
        height: height >= 812 ? 120 : 90
      },
      android: {
        height: 75
      },
    }),
  },
  search_item: {
    height: 38,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    width: width - 80,
    borderBottomWidth: 0,
  },
  icon: {
    marginTop: 22,
    marginRight: 17,
    height: 31,
    width: 31,
  },
  text_input: {
    width: width - 120,
    padding: 0,
  }
});