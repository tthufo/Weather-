import React, { Component } from 'react';
import { TextInput, Platform,Text, View, TouchableOpacity, Dimensions } from 'react-native';

/*
This component created for handle control textinput for japanese
*/

const { width } = Dimensions.get('window');
export default class MyTextInput extends Component {
  state = {
    fakeValue: this.props.value,//pure display here
    refresh: false,//right clear,
  }

  componentDidUpdate(prevProps) {//right clear
    // if (prevProps.value !== this.props.value && this.props.value === '' && Platform.OS === 'ios') {
    //   this.setState({
    //     fakeValue: '',
    //     refresh: true
    //   },
    //     () =>
    //       this.setState({
    //         refresh: false,
    //       },
    //         // () =>
    //         //   this.input.focus()
    //       )); //render null make blur perhaps, so do focus.
    // } // keep for later might need this for ios.
  }

  focus = () => {
    this.input.focus();
  }

  blur = () => {
    this.input.blur();
  }

  clear = () => {
    this.input.clear();
  }

  setFakeValue = fakeValue => this.setState({ fakeValue });//when parent setState({input}), call this too.

  render() {
    if (this.state.refresh) {//right clear
      return null;
    }

    if(this.props.blockEdit && this.props.blockEdit == 'blockEdit'){
      const { widthItem, pWidth } = this.props;
      return (
        <View style={{ backgroundColor: 'white', width: widthItem == null ? width * pWidth : widthItem, borderRadius: 4}}>
           <TextInput
            {...this.props}
            ref={ref => this.input = ref}
            value={(Platform.OS === 'ios' && this.props.typeSet === undefined) ? this.state.fakeValue : this.props.value}//only ios need this.
          />
          <TouchableOpacity
           style={{ position: 'absolute', width:  widthItem == null ? width * pWidth : widthItem, height: 40, top: 0, left: 0, backgroundColor: 'transparent'}}
          />
        </View>
      );
    }

    if(this.props.grow) {
      return (
        <TextInput
          {...this.props}
          multiline={true}
          ref={ref => this.input = ref}
          value={this.props.value}
        />
      );
    }

    return (
      <TextInput
        {...this.props}
        ref={ref => this.input = ref}
        value={this.props.value}
        // value={(Platform.OS === 'ios' && this.props.typeSet === undefined) ? this.state.fakeValue : this.props.value} //only ios need this, might have use it
      />
    );
  }
}
