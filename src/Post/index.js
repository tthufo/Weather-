import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, Dimensions, TextInput, SafeAreaView,
} from 'react-native';
import { Text, Content } from 'native-base';
import RButton from '../elements/RButton';
import { Header } from '../elements';
import Toast from 'react-native-simple-toast';
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
    const { text } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header navigation={navigation} color={'transparent'} title={'Góp ý'} />
        <Content>

          <Text style={{ color: 'black', fontSize: 16, margin: 20, fontWeight: 'normal' }}>{'Phản hồi'}</Text>

          <TextInput
            ref={(e) => this.input = e}
            underlineColorAndroid='transparent'
            autoCompleteType={'off'}
            autoCorrect={false}
            typeSet
            multiline
            style={{
              alignSelf: 'center', borderColor: 'black',
              borderWidth: 1, padding: 10, borderRadius: 10, marginTop: -10, marginBottom: -10,
              width: widthSize - 40, fontSize: 15, height: 200,
              color: 'black'
            }}
            value={text}
            onChangeText={(text) => this.setState({ text })}
            placeholder={'Nhập góp ý của bạn'}
          />

          <Text style={{ color: 'black', fontSize: 14, margin: 20, fontWeight: 'normal' }}>{'Những ý kiến của bạn sẽ giúp chúng tôi nâng cấp dịch vụ. Trân trọng cảm ơn!'}</Text>

          <RButton
            title="Gửi"
            outterProps={{ width: 140, alignSelf: 'center', margin: 5 }}
            innerProps={{ fontSize: 18, fontWeight: 'bold' }}
            onPress={() => this.sendPost()}
          />
        </Content>
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
