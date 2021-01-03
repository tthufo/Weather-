import React from 'react';
import { Button, Text } from 'native-base';

RButton = ({ title, innerProps, outterProps, onPress }) => {
  return (
    <Button onPress={onPress} style={[outterProps ? outterProps : {}, { justifyContent: 'center', backgroundColor: '#5235A0', borderRadius: 30 }]}>
      <Text style={[innerProps]}>
        {title}
      </Text>
    </Button>
  );
}

export default RButton;