import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Item, Label, Button, Icon } from 'native-base';
import TextInput from '../../elements/Input/CustomTextInput';
import string from './string'
import validate from './validators';
import DatePicker from 'react-native-datepicker';

export default class input_styled extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      unhidden: false,
      date: this.value()
    };
  }

  render() {
    const { parent, linkedkey, group, label, validation, showValidation, maxDate, locale, isRight } = this.props;
    const { focused } = this.state;
    const validations = validate(this.value(), validation);

    if (isRight !== undefined || isRight) {
      return (
        <View style={styles.item}>
          <Label style={styles.label}>{label}</Label>
          <Item error={(focused || showValidation) && validations.length > 0} success={(focused || showValidation) && validations.length == 0} style={{ minHeight: 34 }}>
            <TextInput
              style={[this.props.style, { justifyContent: 'center', paddingVertical: 0 }]}
              value={this.state.date}
              editable={false}
              typeSet={true}
            />
            <DatePicker
              style={{ width: 35, marginLeft: 'auto', marginRight: 0 }}
              date={this.state.date}
              mode="date"
              iconSource={require('../../../assets/images/smallCalendar.png')}
              placeholder={string.datePlaceHolder}
              format="YYYY-MM-DD"
              maxDate={maxDate ? maxDate : "2040-01-01"}
              confirmBtnText={string.confirmBtn}
              cancelBtnText={string.cancelBtn}
              showIcon={true}
              hideText={true}
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                }
              }}
              onDateChange={(date) => this.didChooseDate(date)}
              locale={locale}
            />
          </Item>
          {(focused) && validations.map((validate, index) => (
            <Label key={index} style={{ lineHeight: 22 }}>{validate}</Label>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.item}>
        <Label style={styles.label}>{label}</Label>
        <Item error={(focused || showValidation) && validations.length > 0} success={(focused || showValidation) && validations.length == 0} style={{ minHeight: 34 }}>
          <DatePicker
            style={{ width: 35 }}
            date={this.state.date}
            mode="date"
            iconSource={require('../../../assets/images/smallCalendar.png')}
            placeholder={string.datePlaceHolder}
            format="YYYY-MM-DD"
            maxDate={maxDate ? maxDate : "2040-01-01"}
            confirmBtnText={string.confirmBtn}
            cancelBtnText={string.cancelBtn}
            showIcon={true}
            hideText={true}
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              }
            }}
            onDateChange={(date) => this.didChooseDate(date)}
            locale={locale}
          />
          <TextInput
            style={[this.props.style, { justifyContent: 'center', paddingVertical: 0 }]}
            value={this.state.date}
            editable={false}
            typeSet={true}
          />
        </Item>
        {(focused) && validations.map((validate, index) => (
          <Label key={index} style={{ lineHeight: 22 }}>{validate}</Label>
        ))}
      </View>
    );
  }

  didChooseDate(date) {
    const { group, linkedkey, parent } = this.props;
    this.setState({ date: date });
    if (group) {
      parent.state[group][linkedkey] = date;
    } else {
      parent.state[linkedkey] = date;
    }
    parent.setState(parent.state);
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