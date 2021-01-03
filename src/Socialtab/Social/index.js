import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl, ScrollView, LayoutAnimation,
} from 'react-native';
import { Container, Button, Text } from 'native-base';
import { Searchbar } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import STG from '../../../service/storage';
import API from '../../apis';
import NavigationService from '../../../service/navigate';
import _ from 'lodash';

const imageSize = (Dimensions.get('window').width * 9 / 16);
const widthSize = (Dimensions.get('window').width);

export default class social extends Component {

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
      search: '',
      isActionButtonVisible: true,
      condition: { filter: [], status: [] },
    };
    this._listViewOffset = 0
  }

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
    const { offset, condition, search } = this.state;
    const listCropsId = condition.filter.map(e => {
      return e.cropsId;
    })
    try {
      const u = await STG.getData('user')
      const question = await API.user.getQuestion({
        listCropsId,
        listStatus: condition.status,
        subscriber: u.subscribe,
        searchContent: search,
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
    const { question, isActionButtonVisible, isRefreshing, search, condition } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Searchbar
            style={{ borderRadius: 8, marginTop: 30, marginLeft: 10, marginRight: 10 }}
            placeholder={'Nhập nội dung tìm kiếm'}
            onChangeText={(e) => this.setState({ search: e })}
            value={search}
            onSubmitEditing={() => {
              this.onRefresh();
            }}
            autoCompleteType={'off'}
            autoCorrect={false}
            clearButtonMode={'unless-editing'}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 15, margin: 10 }}>{'Lọc theo'}</Text>
            <TouchableOpacity onPress={() => {
              NavigationService.navigate('Filter', { condition, updateFilter: (condition) => this.updateFilter(condition) });
            }}>
              <Text style={{ fontSize: 15, margin: 10, color: '#4B8266' }}>{'Thay đổi'}</Text>
            </TouchableOpacity>
          </View>

          {condition.filter.length != 0 &&
            <View>
              <ScrollView
                style={{ marginRight: 10, marginLeft: 10, marginBottom: 10 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {condition.filter.map((item) => {
                  return (
                    <View style={{ padding: 8, marginRight: 10, backgroundColor: '#faecde', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: 16 }}>{item.cropsName}</Text>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          }

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
            <Button testID="BTN_SIGN_IN" block primary style={[styles.btn_sign_in, styles.floating]} onPress={() => {
              NavigationService.navigate('Question', { updateList: () => this.getQuestion(false) });
            }}>
              <Text style={styles.regularText}>{'Đặt câu hỏi'}</Text>
            </Button>
          }
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
