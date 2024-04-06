import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Image, StyleSheet, StatusBar, ActivityIndicator } from 'react-native'
import Button from '../../Components/Common/Button';
import * as constants from '../../Constants'
import { setActiveModal } from '../../Store/Actions';
import { getAuth } from "firebase/auth";

function Landing({navigation}) {
  const dispatch = useDispatch()
  const autologinFlag = useSelector((state) => state.autologinFlag)

  return (
    <View style={styles.landingPage}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>Blu Budget</Text>
        <Image style={styles.logoImage} source={require('../../assets/BluBudgetLogo.png')}/>
      </View>
      {autologinFlag && 
        <View style={styles.buttonsContainer}>
          <Button 
            title="SIGN UP FOR FREE" 
            style={{marginBottom:15}} 
            onPress={()=>{dispatch(setActiveModal('Sign Up'));navigation.navigate('login')}}
          />
          <Button 
            title="LOGIN" 
            textColor="white" 
            backgroundColor={constants.colors.primaryColor} 
            hideShadow={true}
            onPress={()=>{dispatch(setActiveModal('Login'));navigation.navigate('login')}}
          />
        </View>
      }
      {!autologinFlag && 
        <View style={styles.buttonsContainer}>
          <ActivityIndicator color="white" size="large"/>
        </View>
      }
      
        
    </View>
  );
}

const styles = StyleSheet.create({
  landingPage: {
    height:'100%',
    backgroundColor:constants.colors.primaryColor,
    alignItems:'center'
  },
  logo:{
    position:'absolute',
    top: 200,
    alignItems:'center'
  },
  logoText:{
    fontSize:40,
    fontWeight:'900',
    color:'white'
  },
  logoImage:{
    marginTop:20,
    width:150, 
    height:150
  },
  buttonsContainer:{
    position:'absolute',
    bottom: 100,
    width:'70%'
  }
});

export default Landing;