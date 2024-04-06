import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableHighlight, Alert} from 'react-native';
import { setActiveModal, logout } from '../../Store/Actions';
import Button from '../../Components/Common/Button';
import * as constants from '../../Constants'
import { getAuth } from "firebase/auth";
import * as Linking from 'expo-linking';
import CustomFetch from '../../CustomFetch';

const Settings = ({navigation}) => {
    const user = useSelector((state) => state.firebaseUser)
    const profile = useSelector((state) => state.user)
    const auth = getAuth()
    const dispatch = useDispatch()
    
    function deleteAccount(){
        Alert.alert(
            "Delete Account",
            "By clicking confirm, you will be deleting your account along with all of your data. You will not be able to restore any of your information.",
            [
              {
                text: "Confirm",
                onPress: () => {
                    CustomFetch('DeleteUser', {})
                    .then(result => {
                        if(result['message'] === 'Success')
                            user.delete()
                            .then(() => {
                                dispatch(logout())}, (e) => {console.log(e);console.log('Error Logout')
                            })
                            .catch((error) => {
                                console.log('Firebase error: ' + error.message)
                            });
                        else
                            console.log('Error Deleting User')
                    })
                    .catch(e => {
                        console.log('Error3')
                        console.log(e);
                    });
                },
                style: "confirm",
              },
              {
                text: "Cancel",
                style: "cancel"
              }
            ]
        );
    }
    
    return (
        <View>
            <View style={styles.profile}>
                <View style={styles.circle}>
                    <Text style={styles.circleText}>{profile.firstName[0] + profile.lastName[0]}</Text>
                </View>
                <Text style={styles.profileText}>{profile.firstName + ' ' + profile.lastName}</Text>
                <Text style={styles.profileText}>{profile.email}</Text>
            </View>
            <TouchableHighlight onPress={()=>{navigation.navigate('About');dispatch(setActiveModal('About'));}} underlayColor={constants.colors.primaryColorButLighter}>
                <View style={{...styles.item, borderTopWidth: 0.25, borderTopColor:'grey',}}>
                    <Text style={styles.itemText}>About</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>{Linking.openURL('https://blubudget.com/Support');}} underlayColor={constants.colors.primaryColorButLighter}>
                <View style={styles.item}>
                    <Text style={styles.itemText}>Get Help</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>{navigation.navigate('Privacy');dispatch(setActiveModal('Privacy Policy'));}} underlayColor={constants.colors.primaryColorButLighter}>
                <View style={styles.item}>
                    <Text style={styles.itemText}>Privacy Policy</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>{navigation.navigate('TermsConditions');dispatch(setActiveModal('Terms & Conditions'));}} underlayColor={constants.colors.primaryColorButLighter}>
                <View style={styles.item}> 
                    <Text style={styles.itemText}>Terms & Conditions</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={deleteAccount} underlayColor={constants.colors.primaryColorButLighter}>
                <View style={styles.item}>
                    <Text style={styles.itemText}>Delete Account</Text>
                </View>
            </TouchableHighlight>
            <View style={styles.buttonContainer}>
                <Button 
                    title="Logout" 
                    textColor="white" 
                    style={styles.button}
                    backgroundColor={constants.colors.primaryColor} 
                    onPress={()=>{auth.signOut().then(()=>{dispatch(logout())})}}
                />
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        height:60,
        padding: 10,
        fontSize: 18,
        borderBottomWidth: 0.25,
        borderBottomColor:'grey',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor:'white'
    },
    itemText:{
        fontSize:16,
        fontWeight:'500',
        marginRight:10
    },
    button :{
        width:'50%',
        marginTop:25
    },
    buttonContainer:{
        alignItems:'center'
    },
    profile:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
        marginBottom:20
    },
    circle:{
        borderRadius:80,
        borderColor:'black',
        borderWidth:1,
        width:80,
        height:80,
        backgroundColor:constants.colors.primaryColorButLighter,
        alignItems:'center',
        justifyContent:'center',
        marginRight:8,
        marginBottom:2
      },
      circleText:{
          fontSize:30
      },
      profileText:{
        fontSize:17
      }
  });

export default Settings
