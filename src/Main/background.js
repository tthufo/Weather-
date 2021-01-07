import React, { Component } from 'react';
import { Text, Dimensions, Image } from 'react-native';
import { View } from 'native-base';

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
        source={image == 0 ? require(`../../assets/images/bg_06.png`) : require(`../../assets/images/bg_03.png`)}
      />
    );
  }
}