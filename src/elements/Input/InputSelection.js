import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Item, Label, Button, Icon, Form } from 'native-base';
import TextInput from '../../elements/Input/CustomTextInput';

import validate from './validators';
import ActionSheet from 'react-native-actionsheet';
const CANCEL_INDEX = 0;
const { width, height } = Dimensions.get('window');

export default class input_styled extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      unhidden: false,
      choice: this.value(),
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ choice: this.value() });
  }

  render() {
    const { parent, linkedkey, group, label, validation, showValidation, title } = this.props;
    const { focused, choice } = this.state;
    const validations = validate(this.value(), validation);
    return (
      <View style={styles.item}>
        <Label style={styles.label}>{label}</Label>
        <Item error={(focused || showValidation) && validations.length > 0} success={(focused || showValidation) && validations.length === 0} style={{ minHeight: 34 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 9 }}>
              <TextInput
                style={[this.props.style, { justifyContent: 'center', paddingVertical: 0 }]}
                value={choice}
                editable={false}
                typeSet
              />
            </View>
            <TouchableOpacity onPress={() => this.props.listOption()}>
              <View style={{ flex: 1, paddingTop: 15, width: 30 }}>
                <Image style={{ width: 18 }} source={require('../../../assets/images/type2Down.png')} />
              </View>
            </TouchableOpacity>
          </View>
        </Item>

        {(focused) && validations.map((validate, index) => (
          <Label key={index} style={{ lineHeight: 22 }}>{validate}</Label>
        ))}
      </View>
    );
  }

  value() {
    const { group, linkedkey, parent } = this.props;
    if (group || parent.state[group]) {
      return parent.state[group][linkedkey] || '';
    } else {
      return parent.state[linkedkey] || '';
    }
  }
}

const styles = StyleSheet.create({
  item: {
    marginTop: 24,
    marginLeft: 13,
    marginRight: 13,
  },
  label: {
    // fontFamily: "SourceHanSansHW-Regular",
    fontSize: 15,
    fontWeight: "500",
    color: "#0aa2dd",
    lineHeight: 22
  }
});
