import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions,
} from 'react-native';
import { Container, Button, Text } from 'native-base';
import Toast from 'react-native-simple-toast';
import STG from '../../../service/storage';
import API from '../../apis';
import HOST from '../../apis/host';
import axios from 'axios';
import { Header } from '../../elements';
import _ from 'lodash';

const os = Platform.OS;

const numColumns = 3;
const size = (Dimensions.get('window').width / numColumns) - 10;

export default class crop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login_info: {
        email: false,
        password: false
      },
      show_validation: false,
      modalVisible: false,
      token: null,
      loading: false,
      isConnected: true,
      crops: [],
      max: '',
    };
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    STG.getData('user').then(u => {
      this.getCrops(u.subscribe);
    })
    STG.getData('auto').then(u => {
      this.setState({ max: u ? 4 : 8 })
    })
  }

  async getCrops(subscriber) {
    const forbid = [27, 28, 29, 30, 31, 32]
    var bodyFormData = new FormData();
    const show = await STG.getData('auto')
    const userInfo = await STG.getData('token')
    bodyFormData.append('subscriber', subscriber);
    axios({
      method: 'post',
      url: HOST.BASE_URL + '/appcontent/cropsUser/list-crops-user',
      data: bodyFormData,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Authorization': 'bearer ' + userInfo.access_token,
      }
    }).then(r => {
      if (r.status != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return;
      }
      const resign = r.data.data.filter(e => show ? !forbid.includes(e.cropsId) : e).map(e => {
        e.check = e.cropsUserId == null ? false : (this.getParam().single ? false : true);
        return e;
      });
      this.setState({
        crops: resign,
      })
    }).catch(e => {
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  handleChange = (index) => {
    var newData = [...this.state.crops];
    if (!this.getParam().filter && this.limit().length >= 8 && newData[index].check == false) {
      Toast.show('Bạn chỉ được chọn tối đa 8 loại cây trồng')
      return;
    }
    newData[index].check = !newData[index].check;
    this.setState({ crops: newData });
  };

  limit() {
    const { crops } = this.state;
    const limit = crops.filter(e => e.check == true)
    return limit
  }

  render() {
    const { navigation } = this.props;
    const { crops, max } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Hãy lựa chọn'} />
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={{ alignItems: 'center', padding: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4B8266' }}>Cây trồng</Text>
            {!this.getParam().filter && !this.getParam().single &&
              <Text style={{ fontSize: 14 }}>{`Chọn tối đa ${max} loại cây trồng (${this.limit().length}/${max})`}</Text>}
          </View>

          <View style={{ flex: 8, alignItems: 'center', padding: 0 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={crops}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => {
                  if (!this.getParam().single) {
                    this.handleChange(index)
                  } else {
                    if (this.getParam().updateFilter) {
                      navigation.pop()
                      this.getParam().updateFilter(item)
                    }
                  }
                }}>
                  <View
                    style={styles.itemContainer}>
                    <Image
                      style={styles.item}
                      source={{ uri: item.image }}
                    />
                    <Text style={{ alignSelf: 'center', marginBottom: 10 }}>{item.cropsName}</Text>
                    {item.check &&
                      <View style={{ position: 'absolute', top: 3, left: 5, right: 5, bottom: 5, borderRadius: 12, borderWidth: 1, borderColor: 'black' }} />}
                    {item.check && <Image
                      style={{ width: 30, height: 30, position: 'absolute', right: 10, top: 10 }}
                      source={require('../../../assets/images/select_crops.png')}
                    />}
                  </View>
                </TouchableOpacity>
              )}
              numColumns={numColumns}
              keyExtractor={(item, index) => index}
            />
          </View>

          {!this.getParam().single && <View style={{ padding: 15 }}>
            <Button testID="BTN_SIGN_IN" block primary style={styles.btn_sign_in} onPress={() => {
              if (!this.getParam().filter) {
                this.didPressSubmit()
              } else {
                navigation.pop();
                if (this.getParam().updateFilter) {
                  this.getParam().updateFilter(crops.filter(e => e.check == true));
                }
              }
            }}>
              <Text style={styles.regularText}>{'Lưu'}</Text>
            </Button>
          </View>}
        </View>
      </Container>
    );
  }

  getParam() {
    const { navigation: { state: { params } } } = this.props;
    return params;
  }

  async didPressSubmit() {
    const { crops } = this.state;
    const { navigation: { state: { params: { reload } } }, navigation } = this.props;
    if (this.limit().length == 0) {
      Toast.show('Hãy chọn ít nhất 1 loại cây')
    } else {
      const cropList = crops.filter(e => e.check == true)
      const sub = await STG.getData('user')
      try {
        const result = await API.home.addCrop({
          subscriber: sub.subscribe,
          cropsList: cropList.map(c => { return c.cropsId }),
        })
        if (result.status != 200) {
          Toast.show('Lỗi xảy ra, mời bạn thử lại')
          return
        }
        navigation.pop();
        if (reload) {
          reload();
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    width: 90,
    alignSelf: 'flex-end',
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  itemContainer: {
    width: size,
    height: size + 10,
  },
  item: {
    flex: 1,
    margin: 3,
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
  innerContainer: {
    alignItems: 'center',
    width: 363,
    height: os === 'ios' ? 200 : 270,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#979797"
  },
  regularText: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 20,
  }
});
