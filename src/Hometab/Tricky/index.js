import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions,
} from 'react-native';
import { Container, Text } from 'native-base';
import Toast from 'react-native-simple-toast';
import { Header } from '../../elements';
import NavigationService from '../../../service/navigate';
import _ from 'lodash';

const os = Platform.OS;

const numColumns = 2;
const size = (Dimensions.get('window').width / numColumns) - 10;

export default class tricky extends Component {

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
    };
  }

  async componentDidMount() {
    const show = await STG.getData('auto')
    this.setState({
      crops: show != undefined ? [{ name: 'Chọn cây giống', index: 0, image: require('../../../assets/images/sprout.png'), catId: 3 },
      { name: 'Thổ nhưỡng', index: 1, image: require('../../../assets/images/italy.png'), catId: 4 },] : [
          { name: 'Chọn cây giống', index: 0, image: require('../../../assets/images/sprout.png'), catId: 3 },
          { name: 'Thổ nhưỡng', index: 1, image: require('../../../assets/images/italy.png'), catId: 4 },
          { name: 'Gieo trồng', index: 2, image: require('../../../assets/images/page.png'), catId: 1 },
          { name: 'Thời tiết', index: 3, image: require('../../../assets/images/weather_tips.png'), catId: 5 },
          { name: 'Phân bón', index: 4, image: require('../../../assets/images/fertilizer.png'), catId: 2 },
          { name: 'Tưới tiêu', index: 5, image: require('../../../assets/images/water.png'), catId: 6 },
          { name: 'Dịch bệnh', index: 6, image: require('../../../assets/images/bug.png'), catId: 7 },
          { name: 'Thu hoạch', index: 7, image: require('../../../assets/images/solid.png'), catId: 8 },
        ]
    })
  }

  render() {
    const { crops } = this.state;
    const { navigation: { state: { params: { para } } }, navigation } = this.props;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Mẹo canh tác ' + para.cropsName} />
        <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={crops}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                NavigationService.navigate('ListNews', { para, catId: item.catId, title: item.name });
              }}>
                <View
                  style={styles.itemContainer}>
                  <View style={{ position: 'absolute', top: 3, left: 5, right: 5, bottom: 5, borderRadius: 12, backgroundColor: '#4B8266' }} />
                  <Image
                    style={styles.item}
                    source={item.image}
                  />
                  <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginBottom: 10, color: 'white' }}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            numColumns={numColumns}
            keyExtractor={(item, index) => index}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: size,
    height: size * 0.5,
  },
  item: {
    alignSelf: 'center',
    margin: 10,
    width: 50,
    height: 35,
    resizeMode: 'contain',
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
});
