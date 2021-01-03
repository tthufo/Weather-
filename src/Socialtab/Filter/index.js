import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList,
} from 'react-native';
import { Container, Button, Text, Content } from 'native-base';
import { Header } from '../../elements';
import NavigationService from '../../../service/navigate';
import _ from 'lodash';

const imageSize = (Dimensions.get('window').width * 9 / 16);
const widthSize = (Dimensions.get('window').width);

export default class filter extends Component {

  constructor(props) {
    super(props);
    const { navigation: { state: { params } } } = props;
    this.state = {
      loading: false,
      approve: false,
      deny: false,
      condition: { filter: params.condition.filter, status: params.condition.status },
      offset: 0,
      full: false,
      isRefreshing: false,
    };
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

  changeCondition(name, value) {
    this.setState(prevState => ({
      condition: {
        ...prevState.condition,
        [name]: value,
      }
    }))
  }

  componentDidMount() {
    this.changeCondition('filter', this.getParam().condition.filter);
    if (this.getParam().condition.status.length == 2) {
      this.setState({ approve: true, deny: true });
    } else if (this.getParam().condition.status.length == 1) {
      if (this.getParam().condition.status.includes(1)) {
        this.setState({ deny: true });
      } else {
        this.setState({ approve: true });
      }
    }
  }

  getParam() {
    const { navigation: { state: { params } } } = this.props;
    return params;
  }

  updateFilter(filter) {
    this.changeCondition('filter', filter);
  }

  render() {
    const { navigation } = this.props;
    const { approve, deny, condition } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Lọc'} />
        <Content>
          <View style={{ flexDirection: 'column', flex: 1 }}>

            <View style={{ backgroundColor: '#fdf7f4' }}>
              <Text style={{ fontSize: 15, marginLeft: 10, marginTop: 10 }}>{'Lọc theo'}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, margin: 10 }}>{'Cây trồng'}</Text>
                <TouchableOpacity onPress={() => {
                  NavigationService.navigate('Crop', { filter: true, condition, updateFilter: (filter) => this.updateFilter(filter) });
                }}>
                  <Text style={{ fontSize: 15, margin: 10, color: '#4B8266' }}>{'Thêm'}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <FlatList
                  style={{ marginLeft: 10, marginRight: 10 }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={condition.filter}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                      const clone = [...this.state.condition.filter];
                      const newClone = _.remove(clone, function (n) { return n.cropsId != item.cropsId });
                      this.changeCondition('filter', newClone);
                    }}>
                      <View style={{
                        padding: 8, marginRight: 10, marginBottom: 10,
                        backgroundColor: '#faecde', borderRadius: 6,
                        justifyContent: 'center', alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                        <Text style={{ fontSize: 16 }}>{item.cropsName}</Text>
                        <Image
                          style={{ width: 25, height: 25, marginRight: -8 }}
                          source={require('../../../assets/images/close.png')}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                  }}
                />
              </View>
            </View>

            <View style={{ margin: 10 }}>
              <View>
                <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 0 }}>{'Trạng thái câu hỏi'}</Text>
                <View style={{ flexDirection: 'column' }}>
                  <TouchableOpacity onPress={() => {
                    this.setState({ approve: !this.state.approve }, () => {
                      this.changeCondition('status', this.getStatus())
                    })
                  }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                      <Image
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        source={!approve ? require('../../../assets/images/ic_unchecked.png') : require('../../../assets/images/ic_checked.png')}
                      />
                      <Text style={{ fontSize: 14 }}>{'Đã duyệt'}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this.setState({ deny: !this.state.deny }, () => {
                      this.changeCondition('status', this.getStatus())
                    })
                  }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        source={!deny ? require('../../../assets/images/ic_unchecked.png') : require('../../../assets/images/ic_checked.png')}
                      />
                      <Text style={{ fontSize: 14 }}>{'Chưa duyệt'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ flex: 1, padding: 15 }}>
              <Button testID="BTN_SIGN_IN" block primary style={styles.btn_sign_in} onPress={() => {
                navigation.pop();
                if (this.getParam().updateFilter) {
                  this.getParam().updateFilter(this.state.condition);
                }
              }}>
                <Text style={styles.regularText}>{'Lưu'}</Text>
              </Button>
            </View>
          </View>
        </Content>
      </Container >
    );
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
  }
});
