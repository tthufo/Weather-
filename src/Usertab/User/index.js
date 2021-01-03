import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl, LayoutAnimation,
} from 'react-native';
import { Container, Button, Text } from 'native-base';
import Toast from 'react-native-simple-toast';
import STG from '../../../service/storage';
import API from '../../apis';
import { Header } from '../../elements';
import NavigationService from '../../../service/navigate';
import _ from 'lodash';

const imageSize = (Dimensions.get('window').width * 9 / 16);
const widthSize = (Dimensions.get('window').width);

export default class user extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      approve: false,
      deny: false,
      question: [],
      offset: 0,
      full: false,
      isRefreshing: false,
      userInfo: {},
      isActionButtonVisible: true,
    };
    this._listViewOffset = 0
  }

  _menu = null;

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  getStatus() {
    const { approve, deny } = this.state;
    if (approve && deny) {
      return [2, 1]
    } else if (approve && !deny) {
      return [2]
    } else if (!approve && deny) {
      return [1]
    }
    return []
  }

  componentDidMount() {
    this.getQuestion(false);
  }

  componentWillMount() {
    STG.getData('user').then(userInfo => {
      this.setState({ userInfo })
    })
  }

  async getQuestion(loadMore) {
    const { offset } = this.state;
    try {
      const u = await STG.getData('user')
      const question = await API.user.getQuestion({
        listCropsId: [],
        listStatus: this.getStatus(),
        subscriber: u.subscribe,
        searchContent: "",
        limit: 12,
        offset,
      })
      this.setState({ isRefreshing: false });
      if (question.data.statusCode != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return
      }
      const newQuest = question.data && question.data.data && question.data.data.list
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

  onScrollEnd(event) {
    const CustomLayoutLinear = {
      duration: 100,
      create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
    }
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear)
      this.setState({ isActionButtonVisible })
    }
    this._listViewOffset = currentOffset
  }

  render() {
    const { userInfo, question, approve, deny, isRefreshing, isActionButtonVisible } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header title={'Tài khoản cá nhân'}
        // renderRight={() => (
        //   <Menu
        //     ref={this.setMenuRef}
        //     button={
        //       <TouchableOpacity onPress={() => {
        //         this.showMenu()
        //       }}>
        //         <Image
        //           style={{ width: 30, height: 30 }}
        //           source={require('../../../assets/images/ic_dot_menu.png')}
        //         />
        //       </TouchableOpacity>
        //     }
        //   >
        //     <MenuItem onPress={this.hideMenu}>Hướng dẫn</MenuItem>
        //     <MenuItem onPress={this.hideMenu}>Thông tin</MenuItem>
        //     <MenuItem onPress={this.hideMenu}>Chi tiết</MenuItem>
        //   </Menu>)
        // } 
        />
        <View style={{ flexDirection: 'column', flex: 1 }}>

          <View style={{ margin: 10, padding: 5, }}>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <Image
                style={{ width: 80, height: 80 }}
                source={{ uri: userInfo && userInfo.avatar }}
              />
              <View style={{ padding: 10, flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4B8266' }}>{userInfo && userInfo.fullName}</Text>
                <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 5 }}>{userInfo && userInfo.subscribe}</Text>
                <Button block primary style={styles.btn_sign_in} onPress={() => {
                  NavigationService.navigate('Update', {
                    updateList: () => {
                      STG.getData('user').then(userInfo => {
                        this.setState({ userInfo })
                      })
                    }
                  });
                }}>
                  <Text style={styles.regularText}>{'Chỉnh sửa'}</Text>
                </Button>
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4B8266', marginBottom: 5, marginTop: 0 }}>{'Câu hỏi của tôi'}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => {
                  this.setState({ approve: !this.state.approve }, () => {
                    this.getQuestion(false)
                  })
                }} >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      style={{ width: 35, height: 35 }}
                      source={!approve ? require('../../../assets/images/ic_unchecked_circle.png') : require('../../../assets/images/ic_checked_circle.png')}
                    />
                    <Text style={{ fontSize: 14 }}>{'Đã duyệt'}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.setState({ deny: !this.state.deny }, () => {
                    this.getQuestion(false)
                  })
                }} >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      style={{ width: 35, height: 35 }}
                      source={!deny ? require('../../../assets/images/ic_unchecked_circle.png') : require('../../../assets/images/ic_checked_circle.png')}
                    />
                    <Text style={{ fontSize: 14 }}>{'Chưa duyệt'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={question}
            onScroll={(e) => this.onScrollEnd(e)}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                NavigationService.navigate('Answer', { question: item, updateList: () => this.getQuestion(false) });
              }}>
                <View
                  style={{ flex: 1 }}>
                  <Image
                    style={styles.item}
                    source={item.questionStatus == 1 ? require('../../../assets/images/bg_checking.png') : { uri: item.urlImage && item.urlImage.length != 0 ? "".arr(item.urlImage)[0] : '' }}
                  />
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
                      {[{ title: 'Nhóm cây: ', value: item && item.cropsName }, { title: 'Câu hỏi: ', value: item && item.question }, { title: 'Bệnh lý: ', value: item && item.pathological }].map(e => {
                        return (
                          <View style={{ flexDirection: 'row', marginBottom: 3, marginRight: 10, flexWrap: 'wrap' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15, flexWrap: 'wrap' }}>{e.title}</Text>
                            <Text style={{ fontSize: 15, flexWrap: 'wrap', marginRight: 10, }}>{e.value}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  <Text style={{ textAlign: 'right', fontSize: 15, color: '#4B8266', margin: 5 }}>{item.totalAnswer == 0 ? 'Chưa có câu trả lời' : (item.totalAnswer + ' trả lời')}</Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
                </View>
              </TouchableOpacity>
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
          {isActionButtonVisible &&
            <Button testID="BTN_SIGN_IN" block primary style={[styles.btn_sign, styles.floating]} onPress={() => {
              NavigationService.navigate('Question', { updateList: () => this.getQuestion(false) });
            }}>
              <Text style={styles.regular}>{'Đặt câu hỏi'}</Text>
            </Button>}

        </View>
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    height: 32,
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: 'white',
    borderColor: '#4B8266',
    borderWidth: 1,
  },
  btn_sign: {
    height: 32,
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  item: {
    alignSelf: 'center',
    width: widthSize,
    height: imageSize,
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
  regularText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B8266',
  },
  regular: {
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
