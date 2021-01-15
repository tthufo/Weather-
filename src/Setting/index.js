import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity,
  Image, Switch, SafeAreaView,
} from 'react-native';
import { Text, Content } from 'native-base';
import STG from "../../service/storage";
import { Header } from '../elements';
import RBSheet from "react-native-raw-bottom-sheet";
import _ from 'lodash';
import NavigationService from '../../service/navigate';

const ROW = ({ header, title, value, onPress, onChange, isEnabled }) => {
  return (
    <View style={{ width: '100%', flexDirection: 'column' }}>
      {header &&
        <Text style={{ color: '#3629EF', fontSize: 18, fontWeight: 'normal', marginLeft: 10 }}>{header}</Text>}
      <TouchableOpacity onPress={onPress}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, marginRight: 10, marginTop: 10 }}>
          <Text style={{ color: 'black', fontSize: 16, fontWeight: 'normal' }}>{title}</Text>
          {onChange ? <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#3629EF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            style={{ marginTop: -8 }}
            onValueChange={onChange}
            value={isEnabled}
          /> :
            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'normal' }}>{value}</Text>
          }
        </View>
      </TouchableOpacity>
    </View>
  );
}

const MODAL = ({ data, onPress }) => {
  return (
    <View style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, marginLeft: 10, marginTop: 10 }}>
        <View style={{ height: 35, width: 35 }} />
        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'normal' }}>{data.title}</Text>
        <Image
          style={{ height: 35, width: 35, opacity: 0 }}
          source={require('../../assets/images/rain_probalility.png')}
        />
      </View>

      <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginRight: 10, marginLeft: 10 }}>
        {data.list.map((unit, index) => (
          <View style={{ marginBottom: 15 }}>
            <TouchableOpacity onPress={() => onPress(index)}>
              <Text>
                {unit}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const UNIT = { title: 'Nhiệt độ', list: ['°C', '°F'] }
const WIND = { title: 'Tốc độ gió', list: ['km/h', 'm/s'] }

export default class setting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      weather: [],
      means: 0,
      modalData: {},
      isOn: true,
      isCelsius: true,
      isKm: true,
      isUnit: true,
      isChanged: false,
    };
  }

  navigateTo(route, obj) {
    NavigationService.navigate(route, obj || {})
  }

  componentWillUnmount() {
    const { navigation, navigation: { state: { params: { onReload } } } } = this.props;
    const { isChanged } = this.state;
    if (isChanged && onReload) {
      onReload()
    }
  }

  async componentDidMount() {
    let tempo = await STG.getData("temperature")
    this.setState({ isCelsius: tempo.temp == '1' })
    let windy = await STG.getData("wind")
    this.setState({ isKm: windy.wind == '1' })
  }

  render() {
    const { isOn, isCelsius, isKm } = this.state;
    const { navigation } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header navigation={navigation} color={'transparent'} title={'Tùy chỉnh'} />
        <Content>
          <ROW header={'Nhiệt độ'} title={'Nhiệt độ'} value={isCelsius ? '°C' : '°F'} onPress={() => this.setState({ isUnit: true }, () => this.modal.open())} />
          <ROW title={'Tốc độ gió'} value={isKm ? 'km/h' : 'm/s'} onPress={() => this.setState({ isUnit: false }, () => this.modal.open())} />
          <View style={{ margin: 20 }} />


          {/* <ROW header={'Hiển thị'} title={'Giao diện'} value={'Nền sáng'} onPress={() => console.log('ahihi')} />
          <ROW title={'Ngôn ngữ'} value={'Tiếng việt'} onPress={() => console.log('ahihi')} />
          <View style={{ margin: 20 }} /> */}


          {/* <ROW header={'Khác'} title={'Nhận thông báo'} isEnabled={isOn} onChange={() => this.setState({ isOn: !isOn })} />
          <View style={{ margin: 20 }} />


          <ROW header={'Thông tin ứng dụng'} title={'Giới thiệu'} value={''} onPress={() => this.navigateTo('WebScreen', { header: 'Giới thiệu' })} />
          <ROW title={'Điều khoản sử dụng'} value={''} onPress={() => this.navigateTo('WebScreen', { header: 'Điều khoản sử dụng' })} />
          <ROW title={'Phản hồi dịch vụ'} value={''} onPress={() => this.navigateTo('PostScreen')} />
          <View style={{ margin: 20 }} /> */}

          <RBSheet
            ref={ref => {
              this.modal = ref;
            }}
            closeOnPressMask={true}
            height={120}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'transparent'
              }
            }}
          >
            <MODAL data={this.state.isUnit ? UNIT : WIND} onPress={(index) => {
              if (this.state.isUnit) {
                STG.saveData("temperature", { temp: String(index + 1) });
                this.setState({ isCelsius: index == 0 ? true : false, isChanged: true })
              } else {
                STG.saveData("wind", { wind: String(index + 1) });
                this.setState({ isKm: index == 0 ? true : false, isChanged: true })
              }
              this.modal.close()
            }} />
          </RBSheet>
        </Content>
        <View style={{ margin: 5, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={{ height: 25, width: 120 }}
            source={require('../../assets/images/logo_bottom.png')}
          />
        </View>
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
