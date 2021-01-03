import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, NativeModules, ActivityIndicator, PermissionsAndroid, Alert,
  RefreshControl, TextInput, KeyboardAvoidingView, Keyboard, SafeAreaView,
} from 'react-native';
import { Text } from 'native-base';
import { Header } from '../elements';
import ImagePicker from 'react-native-image-picker';
import {
  PageControlAji,
} from 'react-native-chi-page-control';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import STG from '../../service/storage';
import HOST from '../apis/host';
import API from '../apis';
import _ from 'lodash';

const os = Platform.OS;

const imageSize = (Dimensions.get('window').width * 9 / 16);
const widthSize = (Dimensions.get('window').width);

export default class social extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      question: [],
      offset: 0,
      full: false,
      isRefreshing: false,
      userInfo: {},
      condition: { filter: [], status: [] },
      isShowKeyboard: false,
      image: {},
      text: '',
      quest: this.getParam().question,
      page: 0,
    };
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  componentDidMount() {
    this.getQuestion(false);
    const iOS = os == 'ios'
    this.keyboardDidShowListener = Keyboard.addListener(iOS ? 'keyboardDidShow' : 'keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener(iOS ? 'keyboardDidHide' : 'keyboardDidHide', this._keyboardDidHide);
  }

  componentWillMount() {
    STG.getData('user').then(userInfo => {
      this.setState({ userInfo })
    })
  }

  _keyboardDidShow() {
    this.setState({ isShowKeyboard: true });
  }

  _keyboardDidHide() {
    this.setState({ isShowKeyboard: false });
  }

  async getQuestion(loadMore) {
    const { offset, quest } = this.state;
    try {
      const question = await API.user.getAnswer({
        questionId: this.getParam().question.questionId,
        listStatus: [],
        limit: 12,
        offset,
      })
      this.setState({ isRefreshing: false });
      if (question.data.statusCode != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return
      }
      var newQuest = question.data && question.data.data && question.data.data.list
      newQuest.unshift(quest)
      const totalQuest = question.data && question.data.data && question.data.data.totalRecord
      if (!loadMore) {
        this.setState({ question: newQuest }, () => {
          if (this.state.question.length >= totalQuest) {
            this.setState({ full: true })
          }
        })
      } else {
        this.setState({ question: [...this.state.question, ...newQuest] }, () => {
          if (this.state.question.length >= totalQuest) {
            this.setState({ full: true })
          }
        })
      }
    } catch (e) {
      console.log(e)
      this.setState({ isRefreshing: false });
    }
  }

  async postQuestion() {
    const { text, image, quest } = this.state;
    if (text.length == 0) {
      Toast.show('Bạn chưa chọn nhập câu trả lời')
      return
    }
    const token = await STG.getData('token')
    const userInfo = await STG.getData('user')
    this.setState({ loading: true })
    var bodyFormData = new FormData();

    bodyFormData.append('questionId', this.getParam().question.questionId);
    bodyFormData.append('cropsId', this.getParam().question.cropsId);
    bodyFormData.append('subscriber', userInfo.subscribe);
    bodyFormData.append('answer', text);
    bodyFormData.append('type', userInfo.type);
    if (Object.keys(image).length != 0) {
      bodyFormData.append('listImage', {
        uri: image.uri,
        type: '*/*',
        name: image.fileName,
        data: image.data,
      });
    }
    axios({
      method: 'POST',
      url: HOST.BASE_URL + '/appcontent/question-answer/create-answer',
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
      Keyboard.dismiss();
      this.setState({ text: '', image: {} })
      this.setState(prevState => ({
        quest: {
          ...prevState.quest,
          totalAnswer: this.state.quest.totalAnswer + 1,
        }
      }))
      this.input.clear();
      this.getQuestion(false);
      if (this.getParam().updateList) {
        this.getParam().updateList()
      }
    }).catch(e => {
      this.setState({ loading: false })
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  onRefresh() {
    this.setState({ isRefreshing: true, offset: 0, full: false }, () => {
      this.getQuestion(false)
    });
  }

  onLoadMore() {
    const { offset, full } = this.state;
    if (full) {
      return
    }
    this.setState({ offset: offset + 1 }, () => {
      this.getQuestion(true);
    })
  }

  updateFilter(newCondition) {
    const { condition } = this.state;
    console.log(newCondition)
    const changed = _.isEqual(condition, newCondition)
    this.setState({ condition: newCondition }, () => {
      if (!changed) {
        this.onRefresh();
      }
    });
  }

  getParam() {
    const { navigation: { state: { params } } } = this.props;
    return params;
  }

  async requestAndroid(isCam) {
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
              this.setState({ image: response })
            }
          });
        } else {
          ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              this.setState({ image: response })
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
              this.setState({ image: response })
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
              this.setState({ image: response })
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

  onScrollEnd(e, length) {
    this.setState({ page: e.nativeEvent.contentOffset.x / ((length - 1) * widthSize) })
  }

  render() {
    const { navigation } = this.props;
    const { userInfo, question, isRefreshing, isShowKeyboard, image, text, page, loading } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#4B8266' }}>
        <Header navigation={navigation} title={'Câu hỏi'} />

        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
          style={{ flex: 10 }}
          enabled
          behavior={(Platform.OS === 'ios') ? "padding" : null}
        >
          <View style={{ backgroundColor: '#eef5f9', justifyContent: 'space-between', flex: 1.2 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={question}
              renderItem={({ item, index }) => (
                // <TouchableOpacity onPress={() => {
                // NavigationService.navigate('Answer', {});
                // }}>
                <View
                  style={{ flex: 1 }}>
                  {index == 0 ? item.questionStatus &&
                    item.questionStatus == 1 ?
                    <Image
                      style={styles.item}
                      source={item.questionStatus == 1 ? require('../../assets/images/bg_checking.png') : { uri: item.urlImage && item.urlImage.length != 0 ? "".arr(item.urlImage)[0] : '' }}
                    />
                    :
                    <View>
                      <FlatList
                        style={styles.item}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        horizontal
                        pagingEnabled
                        onScroll={(e) => this.onScrollEnd(e, "".arr(item.urlImage).length)}
                        data={"".arr(item.urlImage)}
                        renderItem={({ item }) => (
                          <Image
                            style={styles.item}
                            source={{ uri: item }}
                          />
                        )}
                        numColumns={1}
                        keyExtractor={(item, index) => index}
                      />
                      <PageControlAji style={{ alignItems: 'center', position: 'absolute', top: imageSize - 30, width: widthSize }} progress={page} numberOfPages={"".arr(item.urlImage).length} />
                    </View> : null
                  }
                  {/* {index != 0 && */}
                  <View style={{ backgroundColor: index == 0 ? '#faecde' : 'white' }}>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={{ uri: item.avatar }}
                      />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontWeight: 'bold', color: '#4B8266', fontSize: 15 }}>{item.fullName}</Text>
                        <Text style={{ fontSize: 12, color: 'gray' }}>{item.createTime}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }}>
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={{ uri: '' }}
                      />
                      <View style={{ marginLeft: 10, marginRight: 10 }}>
                        {index == 0 ? [{ title: 'Nhóm cây: ', value: item && item.cropsName }, { title: 'Câu hỏi: ', value: item && item.question }, { title: 'Bệnh lý: ', value: item && item.pathological }].map(e => {
                          return (
                            <View style={{ flexDirection: 'row', marginBottom: 3, marginRight: 10, flexWrap: 'wrap' }}>
                              <Text style={{ fontWeight: 'bold', fontSize: 15, flexWrap: 'wrap' }}>{e.title}</Text>
                              <Text style={{ fontSize: 15, flexWrap: 'wrap', marginRight: 10, }}>{e.value}</Text>
                            </View>
                          );
                        }) : <View style={{ flexDirection: 'row', marginBottom: 3, marginRight: 10, flexWrap: 'wrap' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, flexWrap: 'wrap' }}>{'Trả lời: '}</Text>
                            <Text style={{ fontSize: 15, flexWrap: 'wrap', marginRight: 10, }}>{item.answer}</Text>
                          </View>}
                      </View>
                    </View>
                  </View>
                  {/* } */}
                  {index == 0 && <Text style={{ backgroundColor: '#faecde', textAlign: 'right', fontSize: 15, color: '#4B8266', padding: 5 }}>{item.totalAnswer == 0 ? 'Chưa có câu trả lời' : (item.totalAnswer + ' trả lời')}</Text>}
                  {index != 0 && item.urlImage &&
                    <Image
                      style={styles.item}
                      source={item.answerStatus == 1 ? require('../../assets/images/bg_checking.png') : { uri: item.urlImage && item.urlImage.length != 0 ? "".arr(item.urlImage)[0] : '' }}
                    />}
                  <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
                </View>
                // </TouchableOpacity>
              )}
              numColumns={1}
              keyExtractor={(item, index) => index}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={() => this.onRefresh()}
                />
              }
              onEndReachedThreshold={0.4}
              onEndReached={() => this.onLoadMore()}
            />
          </View>

          <View style={{ backgroundColor: '#ffffff', flexDirection: 'row', alignItems: 'center', height: 50 }}>
            <Image
              style={{ width: 30, height: 30, marginLeft: 10 }}
              source={{ uri: userInfo && userInfo.avatar }}
            />
            <View style={{ borderWidth: 1, borderRadius: 6, height: 35, marginLeft: 10, justifyContent: 'center' }}>
              <TextInput
                ref={(e) => this.input = e}
                underlineColorAndroid='transparent'
                autoCompleteType={'off'}
                autoCorrect={false}
                typeSet
                style={{ alignSelf: 'center', paddingLeft: 10, paddingRight: 40, width: widthSize - 90, fontSize: 15, height: 40, color: 'black' }}
                value={text}
                onChangeText={(text) => this.setState({ text })}
                placeholder={'Nhập câu trả lời của bạn'}
              />
              <View style={{ position: 'absolute', top: 0, right: 0 }}>
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    "",
                    "Chọn ảnh cập nhật cho câu trả lời",
                    [
                      {
                        text: "Bộ sưu tập",
                        onPress: () => this.callForHelp(false),
                      },
                      {
                        text: "Máy ảnh",
                        onPress: () => this.callForHelp(true),
                      },
                      {
                        text: "Bỏ qua",
                        onPress: () => console.log(""),
                        style: "cancel"
                      }
                    ],
                    { cancelable: false }
                  )
                }}>
                  <Image
                    style={{ width: 35, height: 35 }}
                    source={require('../../assets/images/ic_attach.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {loading ?
                <ActivityIndicator size="small" color="#4B8266" style={{ height: 30, width: 30 }} />
                :
                <TouchableOpacity onPress={() => {
                  this.postQuestion()
                }}>
                  <Image
                    style={{ width: 35, height: 35 }}
                    source={require('../../assets/images/ic_send.png')}
                  />
                </TouchableOpacity>}
            </View>
          </View>
          {!isShowKeyboard && Object.keys(image).length != 0 &&
            <View style={{ height: imageSize }}>
              <Image
                style={{ height: imageSize }}
                source={{ uri: image.uri }}
              />
              <View style={{ position: 'absolute', top: 5, right: 5 }}>
                <TouchableOpacity onPress={() => this.setState({ image: {} })}>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={require('../../assets/images/close.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    height: 32,
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
  item: {
    alignSelf: 'center',
    width: widthSize,
    height: imageSize,
  },
  regularText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  floating: {
    position: 'absolute',
    width: 120,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
  },
});
