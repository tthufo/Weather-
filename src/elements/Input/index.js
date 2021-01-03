import React, { Component } from 'react';
import { View } from 'native-base';
import TextInput from './CustomTextInput';


export default class input extends Component {

  render() {
    if (this.props.parent && this.props.linkedkey) {
      const { parent, linkedkey, group, onChangeText, typeSet, value } = this.props;
      return (
        <View style={{ flex: 1 }}>
          <TextInput
            {...this.props}
            keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
            value={value}
            typeSet={typeSet}
            onChangeText={(text) => {
              if (onChangeText) {
                onChangeText(text);
              }
              this.didChangeText(text)
            }}
            style={[this.props.style, { padding: 0 }]}
          />
        </View>
      );
    }
    else {
      return (
        <View>
          <TextInput style={{ flex: 1 }} {...this.props} />
        </View>
      );
    }
  }

  value() {
    const { group, linkedkey, parent } = this.props;
    if (group || parent.state[group]) {
      return parent.state[group][linkedkey] || '';
    } else {
      return parent.state[linkedkey] || '';
    }
  }

  didChangeText(text) {
    const { group, linkedkey, parent } = this.props;
    if (group) {
      parent.state[group][linkedkey] = text;
    } else {
      parent.state[linkedkey] = text;
    }
    parent.setState(parent.state);
  }
}
