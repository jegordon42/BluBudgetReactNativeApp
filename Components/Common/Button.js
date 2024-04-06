import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as constants from '../../Constants';

const Button = props => {
  const styles = StyleSheet.create({
    button: {
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: props.hideShadow ? 0 : 6,
      shadowOpacity: props.hideShadow ? 0 : 0.26,
      backgroundColor: props.backgroundColor ? props.backgroundColor : 'white',
      borderRadius: 5,
      height:40,
      alignItems:'center',
      justifyContent:'center'
    },
    buttonText:{
      fontSize: props.fontSize === 'small' ? 15 : 20,
      fontWeight: props.fontSize === 'small' ? '400' : '900',
      color: props.textColor ? props.textColor : constants.colors.primaryColor
    }
  });

  return (
    <TouchableOpacity onPress={props.onPress} style={{ ...styles.button, ...props.style }}>
      <Text style={styles.buttonText}>
        {props.title}
      </Text>
    </TouchableOpacity>
  )
};

export default Button;