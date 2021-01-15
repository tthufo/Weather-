import React, { Component } from 'react';
import {
  StyleSheet, Platform, Dimensions, TextInput, SafeAreaView,
} from 'react-native';
import { Text, Content } from 'native-base';
import { Header } from '../elements';
import Toast from 'react-native-simple-toast';
import { WebView } from 'react-native-webview';
import _ from 'lodash';

const os = Platform.OS;

const widthSize = (Dimensions.get('window').width);

export default class post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      weather: [],
      means: 0,
      modalData: {},
      text: '',
    };
  }

  sendPost() {
    const { text } = this.state;
    if (text.length == 0) {
      Toast.show('Hãy nhập ý kiến của bạn')
    }
    console.log('posting')
  }

  render() {
    const { navigation, navigation: { state: { params } } } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header navigation={navigation} color={'transparent'} title={params.header || ''} />
        <WebView
          source={{
            uri: 'https://github.com/facebook/react-native'
          }}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 3,
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
});
