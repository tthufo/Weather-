import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Item, Label, Button, Icon } from 'native-base';
import Input from './index';
import validate from './validators';
import string from './string';
export default class input_styled extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      unhidden: false,
    };
  }

  render() {
    const { parent, linkedkey, group, label, validation, overrideValidation,
      showValidation, keyboardType, onChangeText, typeSet, value, memo, limit } = this.props;
    const { focused } = this.state;
    const validations = validate(value, validation);
    const isMemo = memo !== undefined;
    if (isMemo) {
      return (
        <View style={styles.item}>
          <Label style={styles.memo}>{label}</Label>
          <Item
            error={!overrideValidation && (focused || showValidation) && (value.replace(/\s/g, '') === '' || value.length > limit)}
            success={overrideValidation && (focused || showValidation) && (value.replace(/\s/g, '') !== '' && value.length > 0 && value.length <= limit)}
            style={[{ minHeight: 34 }, this.props.itemStyle]}>
            <Input
              {...this.props}
              keyboardType={keyboardType}
              style={[this.props.style, { justifyContent: 'center' }]}
              secureTextEntry={this.props.secureTextEntry && !this.state.unhidden}
              parent={parent}
              group={group}
              typeSet={typeSet}
              value={value}
              onChangeText={onChangeText}
              linkedkey={linkedkey}
              onFocus={() => this.setState({ ...this.state, focused: true })}
            />
          </Item>

          {
            overrideValidation ? null : ((focused || showValidation) && value.replace(/\s/g, '') === '' ?
              <Label style={{ lineHeight: 22 }}>{string.bothEmpty}</Label>
              :
              validations.map((validate, index) => (
                <Label style={{ lineHeight: 22 }}>{limit === 20 ? string.limitTitle : string.limitContent}</Label>
              )))
          }
        </View>
      );
    }
    return (
      <View style={styles.item}>
        <Label style={styles.label}>{label}</Label>
        <Item
          error={(focused || showValidation) && validations.length > 0}
          success={(focused || showValidation) && validations.length == 0}
          style={[{ minHeight: 34 }, this.props.itemStyle]}>
          <Input
            {...this.props}
            keyboardType={keyboardType}
            style={[this.props.style, { justifyContent: 'center' }]}
            secureTextEntry={this.props.secureTextEntry && !this.state.unhidden}
            parent={parent}
            group={group}
            typeSet={typeSet}
            value={value}
            onChangeText={onChangeText}
            linkedkey={linkedkey}
            onFocus={() => this.setState({ ...this.state, focused: true })}
          />
          {this.renderRightButton()}
        </Item>
        {
          (focused) && validations.map((validate, index) => (
            <Label key={index} style={{ lineHeight: 22 }}>{validate}</Label>
          ))
        }
      </View>
    );
  }

  // render

  renderRightButton() {
    if (this.props.renderRightButton) {
      return this.props.renderRightButton();
    }

    if (this.props.unhidden) {
      return (
        <Button transparent small
          onPress={this.state.unhidden ? () => this.setState({ unhidden: false }) : () => this.setState({ unhidden: true })}
        >
          <Icon active name='md-eye' style={{ color: "#c5c7cd", height: 35 }} />
        </Button>
      )
    }
    return null;
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
    fontSize: 15,
    fontWeight: "500",
    color: "gray",
    lineHeight: 22
  },
  memo: {
    fontSize: 15,
    fontWeight: "500",
    color: "gray",
    lineHeight: 22
  },
});