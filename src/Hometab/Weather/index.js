import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl,
} from 'react-native';
import { Container, Text } from 'native-base';
import Toast from 'react-native-simple-toast';
import STG from '../../../service/storage';
import API from '../../apis';
import WeatherHead from '../../elements/WeatherHead';
import { Header } from '../../elements';
import _ from 'lodash';

const os = Platform.OS;

const numColumns = 3;
const size = (Dimensions.get('window').width / numColumns) - 10;

export default class weather extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      crops: [],
      offset: 0,
    };
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
    this.onRefresh = _.debounce(this.onRefresh, 500, { leading: true, trailing: false });
    this.onLoadMore = _.debounce(this.onLoadMore, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    this.searchCrops();
  }

  async searchCrops() {
    const { offset } = this.state;
    try {
      const crops = await API.home.searchCrop({
        categoryId: 5,
        cropsId: 6,
        cropsPostId: null,
        limit: 12,
        offset,
      })
      this.setState({ isRefreshing: false });
      console.log('==>', crops)
      if (crops.data.statusCode != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return
      }
    } catch (e) {
      console.log(e)
      this.setState({ isRefreshing: false });
    }
  }

  onRefresh() {
    this.setState({ isRefreshing: true, offset: 0 }, () => {
      this.searchCrops()
    });
  }

  onLoadMore() {
    this.searchCrops();
  }

  render() {
    const { navigation } = this.props;
    const { crops, isRefreshing } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Thời tiết'} />
        <View style={{ flexDirection: 'column', flex: 1 }}>

          <WeatherHead delay={3200} />

          <View style={{ flexGrow: 1, alignItems: 'center', padding: 0 }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={crops}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => console.log('sfsfd')}>
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
              refreshControl={
                <RefreshControl
                  style={{ color: 'red' }}
                  refreshing={isRefreshing}
                  onRefresh={this.onRefresh}
                />
              }
              onEndReachedThreshold={0.4}
              onEndReached={this.handleLoadMore}
            />
          </View>

        </View>
      </Container>
    );
  }

  async didPressSubmit() {
    const { crops } = this.state;
    const { navigation } = this.props;
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
      } catch (e) {
        console.log(e)
      }
    }
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
    fontSize: 24,
  }
});
