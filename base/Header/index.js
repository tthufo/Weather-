import React, { Component } from 'react';
import {
  Header,
  Left,
  Body,
  Right,
  Label
} from 'native-base';
import string from './string';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

const os = Platform.OS;

const coloring = '#3629EF';

export default class index extends Component {
  render() {
    const { title, current, total, height, color } = this.props;
    let progress = '';
    if (total != null && current != null) {
      progress = current + '/' + total;
    }
    const cor = color ? color : coloring
    return (
      height ? <Header style={{ height: height, backgroundColor: cor, borderBottomColor: cor }} /> :
        <Header style={{ backgroundColor: cor, borderBottomColor: cor }}>
          {this.renderLeft()}
          <Body
            style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}
          >
            <View
              style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center', paddingLeft: 20, paddingRight: 10 }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.bodyTitle}
              >
                {title}
              </Text>
              {
                this.props.childTitle &&
                <Text style={styles.childTitle} numberOfLines={1} ellipsizeMode={'tail'}>{this.props.childTitle}</Text>
              }
              {progress.length > 0 && (
                <Label style={styles.label_small}>{progress}</Label>
              )}
            </View>
          </Body>
          {this.renderRight()}
        </Header>
    );
  }

  renderRight() {
    if (this.props.renderRight) {
      return (
        <Right style={{ flex: 0.3 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            {this.props.renderRight()}
          </View>
        </Right>);
    } else if (this.props.rightText) {
      return (
        <Right style={{ flex: 0.3 }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 17,
                color: '#ffffff'
              }}
            >
              {this.props.rightText}
            </Text>
          </View>
        </Right>
      );
    } else if (this.props.rightAttachFile) {
      return (
        <Right style={{ flex: 0.3 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            <TouchableOpacity onPress={this.props.onAttachFile}>
              {/* <Image
                style={{ width: 35, height: 35 }}
                source={require('../../../assets/images/ic_attach_file.png')}
              /> */}
            </TouchableOpacity>
          </View>
        </Right>
      );
    } else if (this.props.rightDownloadFile) {
      return (
        <Right style={{ flex: 0.3 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            {/* {Platform.OS == 'android' ? (
              <TouchableOpacity onPress={this.props.onDownloadFile}>
                <Image
                  style={{ width: 35, height: 35 }}
                  source={require('../../../assets/images/ic_download.png')}
                />
              </TouchableOpacity>
            ) : (
              <Image
                style={{ width: 35, height: 35 }}
                source={require('../../../assets/images/ic_download.png')}
              />
            )
            } */}
          </View>
        </Right>
      );
    } else {
      return <Right style={{ flex: 0.3 }} />;
    }
  }

  renderLeft() {
    if (this.props.navigation && this.props.hideLeft === undefined) {
      return (
        <Left style={{ flex: 0.3 }}>
          <TouchableOpacity
            testID="BTN_BACK"
            onPress={
              this.props.isWalkThough == true
                ? () => this.props.navigation.pop(2)
                : () => {
                  this.props.navigation.goBack();
                  if (this.props.handleWhenBack) this.props.handleWhenBack();
                }
            }
          >
            <View
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
              <Image
                style={{ width: 35, height: 35, marginRight: 5, marginLeft: 10 }}
                source={require('../../assets/images/back_color.png')}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 17,
                  fontWeight: 'bold',
                }}
              >
                {''}
              </Text>
            </View>
          </TouchableOpacity>
        </Left>
      );
    } else {
      return <Left style={{ flex: 0.3 }} />;
    }
  }
}

const styles = StyleSheet.create({
  bodyTitle: {
    color: coloring,
    fontSize: 17,
    fontWeight: 'normal',
    textAlign: 'center',
    lineHeight: 22,
  },
  childTitle: {
    color: coloring,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22
  },
  label_small: {
    color: coloring,
    lineHeight: 22
  }
});
