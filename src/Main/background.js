import React, { Component } from 'react';
import { Dimensions, Image } from 'react-native';
import IC from '../elements/icon';

const { width, height } = Dimensions.get('window');

export default class background extends Component {

  constructor(props) {
    super(props);
    this.state = {
      image: 0,
    }
    this.didChangeImage = this.didChangeImage.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this, this.didChangeImage);
    }
  }

  didChangeImage(image) {
    this.setState({ image })
  }

  render() {
    const { image } = this.state;
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY_BG : IC.NIGHT_BG
    const ICON_DEFAULT = h <= 19 && h >= 7 ? IC.DEFAULT_BG_DAY : IC.DEFAULT_BG_NIGHT
    const imaging = ICON[image] && ICON[image].icon
    console.log(ICON[image])
    return (
      <Image
        style={{
          width: width,
          height: height,
          resizeMode: 'cover',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        source={imaging || ICON_DEFAULT}
      />
    );
  }
}