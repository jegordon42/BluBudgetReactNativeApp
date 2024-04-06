import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import { setActiveModal } from '../../Store/Actions';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../Components/Common/Button';
import * as constants from '../../Constants'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const ForgotPassword = ({ route, navigation }) => { 
    const [email, setEmail] = useState(route.params.email)
    const [emailError, setEmailError] = useState('')
    const dispatch = useDispatch();
    const auth = getAuth()

    return (
        <View style={styles.page}>
            <TextInput 
                style={styles.textInput}
                onChangeText={setEmail}
                value={email}
                placeholder="Email Address"
            />
            <View style={styles.errorContainer}>
                {emailError !== '' &&
                <Text style={styles.error}>{emailError}</Text>
                }
            </View>
            <Button 
              title="Send Email" 
              textColor="white" 
              style={styles.button}
              backgroundColor={constants.colors.primaryColor} 
              onPress={()=>{
                sendPasswordResetEmail(auth, email, {url:'https://budgetapp-38953.firebaseapp.com', handleCodeInApp:false})
                .then(result => {
                    Alert.alert('Email Sent')
                    dispatch(setActiveModal('Login'))
                    navigation.goBack()
                })
                .catch((error) => {
                  if(error.message.includes('user-not-found'))
                    Alert.alert('Account not found')
                  else if(error.message.includes('invalid'))
                    Alert.alert('Invalid Email')
                  else if(error.message.includes('missing'))
                    Alert.alert('Please enter an email')
                  console.log(error.message)
                });
              }}
          />
        </View>
        
    );
}

const styles = StyleSheet.create({
    page: {
      alignItems:'center',
      paddingTop:25,
      backgroundColor:constants.colors.backgroundColor,
      height:'100%'
    },
    textInput:{
      width:'90%',
      borderWidth:1,
      borderRadius:5,
      height:50,
      marginTop:10,
      padding:5,
      borderColor:'#c7c7c7'
    },
    errorContainer:{
      width:'90%'
    },  
    error:{
      color:'red',
      textAlign:'left'
    },
    button:{
      width:'90%',
      marginTop: 10
    }
  });

export default ForgotPassword
