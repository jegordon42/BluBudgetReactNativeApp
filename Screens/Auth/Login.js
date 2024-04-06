import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, setActiveModal } from '../../Store/Actions';
import { Text, View, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native'
import Button from '../../Components/Common/Button';
import * as constants from '../../Constants'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';  

function Login({navigation}) {
  const page = useSelector(state => state.activeModal)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const  dispatch = useDispatch()
  const auth = getAuth();
  const [checkedAgreeError, setCheckedAgreeError] = useState('')
  const [checkedAgree, setCheckedAgree] = useState(false)

  

  function SignUpUser(){
    if(isLoading)
      return
    if(validated('SignUp')){
      setIsLoading(true)
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;
        const token = userCredential['_tokenResponse']['idToken']
        const refreshToken = userCredential['_tokenResponse']['refreshToken']
        const userId = userCredential['_tokenResponse']['localId']

        fetch(constants.url + 'SignUp', {
          method: "POST",
          headers: { 
            "Content-type": "application/json",
            "authorization" : token
          },
          body: JSON.stringify({
              firstName, 
              lastName,
              email,
              password,
              userId
          })
        })
        .then(response => response.json())
        .then(result => {
          if(result['message'] == 'Success'){
            result['firebaseUser'] = firebaseUser
            dispatch(login(result, true))
          }
          else{
            console.log(result)
            setIsLoading(false)
          }
        })
        .catch(e => {
            console.log(e);
            setIsLoading(false)
        });
      })
      .catch((error) => {
        setIsLoading(false)
        showFirebaseError(error.code)
        console.log(error.message)
      });
    }
  }

  function LoginUser(){
    if(isLoading)
      return
    
    if(validated('Login')){
      setIsLoading(true)
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const token = userCredential['_tokenResponse']['idToken']
        const userId = userCredential['_tokenResponse']['localId']
        fetch(constants.url + 'Login', {
          method: "POST",
          headers: { 
            "Content-type": "application/json",
            "authorization" : token
          },
          body: JSON.stringify({
              userId : userId
          })
        })
        .then(response => response.json())
        .then(result => {
          if(result['message'] == 'Success'){
            result['firebaseUser'] = user
            dispatch(login(result, false))
          }
          else{
            console.log(result)
          }
        })
        .catch(e => {
            console.log(e);
        });
      })
      .catch((error) => {
        setIsLoading(false)
        showFirebaseError(error.code)
        console.log(error.message)
      });
    }
  }

  function validated(type){
    var isValid = true
    setEmailError('')
    setPasswordError('')
    setFirstNameError('')
    setLastNameError('')
    setCheckedAgreeError('')
    if(!email){
      setEmailError('Email Required')
      isValid = false
    }
    if(!password){
      setPasswordError('Password Required')
      isValid = false
    }
    if(type === 'SignUp'){
      if(!checkedAgree){
        setCheckedAgreeError('Please agree before continuing')
        isValid = false
      }
      if(!firstName ){
        setFirstNameError('First Name Required')
        isValid = false
      }
      if(!lastName){
        setLastNameError('Last Name Required')
        isValid = false
      }
      if(password !== confirmPassword){
        setPasswordError('The passwords do not match.')
        isValid = false
      }
    }
    return isValid
  }

  function showFirebaseError(error){
    if(error === 'auth/invalid-email')
      Alert.alert('The email provided is invalid.')
    else if(error === 'auth/email-already-in-use')
      Alert.alert('There is already an account using this email.')
    else if(error === 'auth/weak-password')
      Alert.alert('Your password must be at least 6 characters.')
    else if(error === 'auth/user-not-found')
      Alert.alert('The email provided is not associated with an account.')
    else if(error === 'auth/wrong-password')
      Alert.alert('Incorrect Password')
    else if(error === 'auth/too-many-requests')
      Alert.alert('Too many login attempts, please try again later.')
    else
      Alert.alert(error)
  }

  return (
    <View style={styles.loginPage}>
      {page === 'Sign Up' &&
        <>
          <TextInput 
            style={styles.textInput}
            onChangeText={setFirstName}
            value={firstName}
            placeholder="First Name"
          />
          <View style={styles.errorContainer}>
            {firstNameError !== '' &&
              <Text style={styles.error}>{firstNameError}</Text>
            }
          </View>
        </>
      }
      {page === 'Sign Up' &&
        <>
          <TextInput 
            style={styles.textInput}
            onChangeText={setLastName}
            value={lastName}
            placeholder="Last Name"
          />
          <View style={styles.errorContainer}>
              {lastNameError !== '' &&
                <Text style={styles.error}>{lastNameError}</Text>
              }
          </View>
        </>
      }
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

      <TextInput 
        style={styles.textInput}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
      />
      <View style={styles.errorContainer}>
        {passwordError !== '' &&
          <Text style={styles.error}>{passwordError}</Text>
        }
      </View>

      {page === 'Sign Up' &&
        <>
          <TextInput 
            style={styles.textInput}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
          />
          <View style={{width:'90%',flexDirection:'row', justifyContent:'flex-start', alignItems:'center', marginTop:15,marginBottom:5}}>
            <CircleCheckBox
                checked={checkedAgree}
                onToggle={() => {setCheckedAgree(!checkedAgree)}}
                outerColor={constants.colors.primaryColor}
                innerColor={constants.colors.primaryColorButLighter}
                styleLabel={{fontSize:18, marginLeft:10}}
            />
            <Text style={{marginLeft:10, fontSize:17}}>
              I agree to the 
              <Text style={{color:constants.colors.primaryColor}} onPress={()=> {navigation.navigate('TermsConditions');dispatch(setActiveModal('Terms & Conditions'));}}>
                {' Terms '}
              </Text> 
              and 
              <Text style={{color:constants.colors.primaryColor}} onPress={()=> {navigation.navigate('Privacy');dispatch(setActiveModal('Privacy Policy'));}}>
                {' Privacy Policy '}
              </Text> 
            </Text>
          </View>
          <View style={styles.errorContainer}>
            {checkedAgreeError !== '' &&
              <Text style={styles.error}>{checkedAgreeError}</Text>
            }
          </View>
          <Button 
              title="SIGN UP" 
              textColor="white" 
              style={styles.button}
              backgroundColor={constants.colors.primaryColor} 
              onPress={SignUpUser}
          />
        </>
      }
      {page === 'Login' &&
        <>
          <Button 
              title="LOGIN" 
              textColor="white" 
              style={styles.button}
              backgroundColor={constants.colors.primaryColor} 
              onPress={LoginUser}
          />
          <Button 
            title="Forgot Password?" 
            textColor="blue" 
            fontSize="small"
            backgroundColor={constants.colors.backgroundColor}
            style={styles.button}
            hideShadow={true}
            onPress={()=> {dispatch(setActiveModal('Forgot Password'));navigation.navigate('forgotPassword', {email});}}
          />
        </>
      }
      {isLoading &&
        <View>
          <ActivityIndicator color={constants.colors.primaryColor} size="large"/>
          <Text>Please wait, this may take a minute or two</Text>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  loginPage: {
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

export default Login;