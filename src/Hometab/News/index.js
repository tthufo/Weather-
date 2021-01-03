import React, { Component } from 'react';
import {
  StyleSheet, Dimensions,
} from 'react-native';
import {
  WebView,
} from 'react-native-webview';
import { Container } from 'native-base';
import Toast from 'react-native-simple-toast';
import API from '../../apis';
import { Header } from '../../elements';
import _ from 'lodash';

const imageSize = (Dimensions.get('window').width * 9 / 16);
const widthSize = (Dimensions.get('window').width);

export default class news extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      crops: [
      ],
    };
  }

  componentDidMount() {
    this.searchCrops()
  }

  async searchCrops() {
    const { navigation: { state: { params: { para } } } } = this.props;
    try {
      const crops = await API.home.searchCrop({
        categoryId: null,
        cropsId: null,
        cropsPostId: para.cropsPostId,
        limit: null,
        offset: null,
      })
      if (crops.data.statusCode != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return
      }
      const newCrops = crops.data && crops.data.data && crops.data.data.listCropsPost
      this.setState({ crops: newCrops })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { crops } = this.state;
    const { navigation: { state: { params: { para } } }, navigation } = this.props;
    const item = crops.length != 0 && crops[0];

    const imateUrl = item && item.urlImage ? "".arr(item.urlImage)[0] : ''

    const ht = "<html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style>body { font-size: 100%; word-wrap: break-word; overflow-wrap: break-word; margin: 10px }img{max-width:100%;height:auto !important;width:auto !important;};</style></head>"
      + "<body style='margin:0; padding:0;'>" + "<span><img style=\"width:" + widthSize + "!important;height:" + imageSize + "!important;\" src=\"" + imateUrl + "\"><\/span>" + "<h4 style=\"text-align: left; margin-top: 5; color: #4B8266;\"><span><strong>" + (item ? item.titlePost : '') + "</strong></span></h4>" + "<p style=\"text-align: left; margin-top: -15;\"><span>" + (item ? item.summaryPost : '') + "</span></p>" + (item ? item.detailPost : '') + "</body></html>";

    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={para.categoryName} />
        {/* <View>
            <Image
              style={styles.item}
              source={{ uri: item && item.urlImage ? (item.urlImage.replace(/\["/g, "")).replace(/"\]/g, "") : '' }}
            />
            <Text style={{ fontWeight: 'bold', margin: 5, color: '#4B8266', fontSize: 15 }}>{item && item.titlePost}</Text>
            <Text style={{ margin: 5, fontSize: 13 }}>{item && item.summaryPost}</Text>
          </View> */}
        <WebView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          style={{ resizeMode: 'cover', flex: 1, margin: 10 }}
          injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          source={{ html: ht }}
          scalesPageToFit={false}
        />
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  item: {
    alignSelf: 'center',
    margin: 10,
    width: 50,
    height: 35,
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
});
