import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl,
} from 'react-native';
import { Container, Text } from 'native-base';
import Toast from 'react-native-simple-toast';
import STG from '../../../service/storage';
import API from '../../apis';
import { Header } from '../../elements';
import NavigationService from '../../../service/navigate';
import _ from 'lodash';

const imageSize = (Dimensions.get('window').width * 9 / 16);
const widthSize = (Dimensions.get('window').width);

export default class listnews extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      crops: [],
      offset: 0,
      full: false,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.searchCrops(false);
  }

  async searchCrops(loadMore) {
    const { offset } = this.state;
    const { navigation: { state: { params: { para, catId } } } } = this.props;
    try {
      const crops = await API.home.searchCrop({
        categoryId: catId,
        cropsId: para.cropsId,
        cropsPostId: null,
        limit: 12,
        offset,
      })
      this.setState({ isRefreshing: false });
      if (crops.data.statusCode != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return
      }
      const newCrops = crops.data && crops.data.data && crops.data.data.listCropsPost
      const totalCrops = crops.data && crops.data.data && crops.data.data.totalRecord
      if (!loadMore) {
        this.setState({ crops: newCrops }, () => {
          if (this.state.crops.length >= totalCrops) {
            this.setState({ full: true })
          }
        })
      } else {
        this.setState({ crops: [...this.state.crops, ...newCrops] }, () => {
          if (this.state.crops.length >= totalCrops) {
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
      this.searchCrops(false)
    });
  }

  onLoadMore() {
    const { offset, full } = this.state;
    if (full) {
      return
    }
    this.setState({ offset: offset + 1 }, () => {
      this.searchCrops(true);
    })
  }

  render() {
    const { crops, isRefreshing } = this.state;
    const { navigation: { state: { params: { title } } }, navigation } = this.props;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={title} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={crops}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              NavigationService.navigate('News', { para: item });
            }}>
              <View
                style={{ flex: 1 }}>
                <Image
                  style={styles.item}
                  source={{ uri: item.urlImage && item.urlImage.length != 0 ? "".arr(item.urlImage)[0] : '' }}
                />
                <Text style={{ fontWeight: 'bold', margin: 5, color: '#4B8266', fontSize: 15 }}>{item.titlePost}</Text>
                <Text style={{ margin: 5, fontSize: 13 }}>{item.summaryPost}</Text>
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
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginTop: 30,
    width: 90,
    alignSelf: 'flex-end',
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
    lineHeight: 22,
    fontSize: 24,
  }
});
