import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, ActivityIndicator, NativeModules,
  Alert, TouchableOpacity, TextInput, Image, PermissionsAndroid, ScrollView
} from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { max, required } from '../elements/Input/validators';
import { Header } from '../elements';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import STG from "../../service/storage";
import HOST from '../apis/host';
import axios from 'axios';
import NavigationService from '../../service/navigate';
import _ from 'lodash';

const os = Platform.OS;

const validations = {
  email: {
    label: 'Phone',
    validations: [
      required,
      max(10),
    ]
  },
  password: {
    label: 'Password',
    validations: [
      required,
    ]
  }
}

function remove(arrOriginal, elementToRemove) {
  return arrOriginal.filter(function (el) { return el !== elementToRemove });
}

const FIELD = ({ obj, onChange, value }) => {
  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{obj.title}</Text>
      <TextInput
        style={{ textAlignVertical: 'top', padding: 10, height: obj.height, borderColor: 'black', borderWidth: 1, borderRadius: 8 }}
        multiline
        autoCompleteType={'off'}
        autoCorrect={false}
        onChangeText={onChange}
        value={value}
        placeholder={obj.placeholder}
      />
    </View>
  );
};

export default class question extends Component {

  constructor(props) {
    super(props);
    const { navigation: { state: { params } } } = props;
    this.state = {
      question: '',
      answer: '',
      loading: false,
      crops: params.para ? params.para : {},
      images: [],
    };

    this.allowedImageFormats = ['image/jpeg', 'image/jpg', 'image/png'];
  }

  async requestAndroid(isCam) {
    if (this.state.images.length >= 5) {
      Toast.show('Bạn chỉ được chọn tối đa 5 ảnh')
      return
    }
    try {
      const granted = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      )
      if (granted) {
        const storage = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        )

        if (!storage) {
          Alert.alert('Thông báo', 'Access android');
          return;
        }

        const camera = await PermissionsAndroid.checkPermission(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        )

        if (!camera) {
          Alert.alert('Thông báo', 'Access android');
        }

        const sdCard = await PermissionsAndroid.checkPermission(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        )

        if (!sdCard) {
          Alert.alert('Thông báo', 'Access SD');
        }

        if (!sdCard || !camera) {
          return;
        }

        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
        if (isCam) {
          ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              this.setState({ images: [...this.state.images, response] })
            }
          });
        } else {
          ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              this.setState({ images: [...this.state.images, response] })
            }
          });
        }
      } else {
        Alert.alert('Thông báo', 'acccess please');
      }
    } catch (err) {
      console.warn(err)
    }
  }

  requestIos(isCam) {
    if (this.state.images.length >= 5) {
      Toast.show('Bạn chỉ được chọn tối đa 5 ảnh')
      return
    }
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    if (!isCam) {
      NativeModules.Permission.getPermissionPhotoLibrary((alert, index) => {
        if (index === 3 || index === 0) {
          ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              this.setState({ images: [...this.state.images, response] })
            }
          });
        } else {
          Alert.alert('Thông báo', 'access lib')
        }
      });
    } else {
      NativeModules.Permission.getPermissionCamera((alert, index) => {
        if (index === 3 || index === 0) {
          ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              this.setState({ images: [...this.state.images, response] })
            }
          });
        } else {
          Alert.alert('Thông báo', 'access cam')
        }
      });
    }
  }

  callForHelp(isCam) {
    if (os === 'ios') {
      this.requestIos(isCam)
    } else {
      this.requestAndroid(isCam)
    }
  }

  updateFilter(filter) {
    this.setState({ crops: filter });
  }

  async didPressSubmit() {
    const { navigation } = this.props;
    const { question, answer, images, crops } = this.state;
    if (Object.keys(crops).length == 0) {
      Toast.show('Bạn chưa chọn loại cây trồng')
      return
    }
    if (question.length == 0) {
      Toast.show('Bạn chưa điền câu hỏi')
      return
    }
    if (answer.length == 0) {
      Toast.show('Bạn chưa điền bệnh lý câu trồng')
      return
    }
    if (images.length == 0) {
      Toast.show('Bạn cần chọn ít nhất 1 ảnh')
      return
    }
    const token = await STG.getData('token')
    const userInfo = await STG.getData('user')
    this.setState({ loading: true })
    var bodyFormData = new FormData();
    bodyFormData.append('cropsId', crops.cropsId);
    bodyFormData.append('subscriber', userInfo.subscribe);
    bodyFormData.append('question', question);
    bodyFormData.append('pathological', answer);
    images.map(e => {
      bodyFormData.append('listImage', {
        uri: e.uri,
        type: '*/*',
        name: e.fileName,
        data: e.data,
      });
    })
    axios({
      method: 'POST',
      url: HOST.BASE_URL + '/appcontent/question-answer/create-question',
      data: bodyFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'bearer ' + token.access_token,
      }
    }).then(r => {
      this.setState({ loading: false })
      if (r.status != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return;
      }
      navigation.pop();
      if (this.getParam().updateList) {
        this.getParam().updateList()
      }
      Toast.show('Tạo câu hỏi thành công')
    }).catch(e => {
      this.setState({ loading: false })
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  getParam() {
    const { navigation: { state: { params } } } = this.props;
    return params;
  }

  render() {
    const { navigation } = this.props;
    const { crops, question, answer, images, loading } = this.state;
    return (
      <Container>
        <Header navigation={navigation} title={'Bác sỹ cây trồng'} />
        <Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {Object.keys(crops).length != 0 ?
              <View>
                <TouchableOpacity onPress={() => {
                  this.setState({ crops: {} })
                }}>
                  <View style={{
                    padding: 8, margin: 5,
                    backgroundColor: '#faecde', borderRadius: 6,
                    justifyContent: 'center', alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                    <Text style={{ fontSize: 16 }}>{crops.cropsName || ''}</Text>
                    <Image
                      style={{ width: 25, height: 25, marginRight: -8 }}
                      source={require('../../assets/images/close.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View> : <View />
            }
            <TouchableOpacity onPress={() => {
              NavigationService.navigate('Crop', { single: true, updateFilter: (condition) => this.updateFilter(condition) });
            }}>
              <Text style={{ fontSize: 15, margin: 10, color: '#4B8266' }}>{'Chọn cây trồng'}</Text>
            </TouchableOpacity>

          </View>
          <View style={{ padding: 10 }}>
            <FIELD onChange={(question) => this.setState({ question })} value={question} obj={{ title: 'Câu hỏi *', height: 100, placeholder: 'Bạn đang gặp vấn đề gì với cây trồng của mình ?' }} />
            <View style={{ height: 20 }} />
            <FIELD onChange={(answer) => this.setState({ answer })} value={answer} obj={{ title: 'Bệnh lý cây trồng *', height: 150, placeholder: 'Các biểu hiện của cây đang như thế nào ?' }} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.btn_register} onPress={() => {
              this.callForHelp(true)
            }}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../../assets/images/camera.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn_register} onPress={() => {
              this.callForHelp(false)
            }}>
              <Text style={{ color: '#4B8266' }}>{'Chọn hình ảnh'}</Text>
            </TouchableOpacity>
          </View>

          {images.length != 0 ?
            <View>
              <ScrollView
                style={{ marginRight: 10, marginLeft: 10, marginBottom: 10 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {images.map((item) => {
                  return (
                    <TouchableOpacity onPress={() => {
                      const removed = remove(this.state.images, item);
                      this.setState({ images: removed });
                    }}>
                      <View style={{
                        marginRight: 10,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Image
                          style={{ width: 70, height: 70, borderRadius: 8 }}
                          source={{ uri: item.uri }}
                        />
                        <Image
                          style={{ position: 'absolute', width: 25, height: 25, top: 3, right: 3 }}
                          source={require('../../assets/images/close.png')}
                        />
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View> : <View style={{ height: 70 }} />
          }

          <View style={{ padding: 15 }}>
            {loading ?
              <ActivityIndicator size="large" color="#4B8266" style={{ marginTop: 15 }} />
              :
              <Button testID="BTN_SIGN_IN" block primary style={styles.btn_sign_in} onPress={() => {
                this.didPressSubmit()
              }}>
                <Text style={styles.regularText}>{'Gửi'}</Text>
              </Button>}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginTop: 30,
    width: 120,
    borderRadius: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
    backgroundColor: '#4B8266',
  },
  btn_forgot_password: {
    marginTop: 22,
    height: 44,
  },
  btn_register: {
    margin: 10,
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
  }
});
