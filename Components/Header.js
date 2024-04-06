import React from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import * as constants from '../Constants'
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { setActiveTab, setActiveModal, saveForm, setFilter, finishSetup } from '../Store/Actions';
import { useSelector, useDispatch } from 'react-redux';
import TermsConditions from '../Screens/Settings/TermsConditions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = props => {
  const activeTab = useSelector(state => state.activeTab)
  const activeModal = useSelector(state => state.activeModal)
  const type = useSelector(state => state.filters.type.replace('es', 'e'))
  const initials = useSelector(state => state.user ? state.user.firstName[0] + state.user.lastName[0] : '')
  const title = props.title
  const isCard = ['Settings', 'Terms & Conditions', 'About', 'Privacy Policy'].includes(title) || ['Sign Up', 'Login', 'Forgot Password'].includes(activeModal)
  const isModal = !isCard && title != undefined
  const isTab = props.isTab
  const isSetup = useSelector(state => state.isSetup)
  const user = useSelector(state => state.user)
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  console.log(insets)

  const styles = StyleSheet.create({
    header: {
      width: '100%',
      height: isModal ? 60 + insets.top - insets.top: activeModal.includes('Set Up') ? 53 + insets.top : isCard ? 43 + insets.top : 33 + insets.top,
      backgroundColor: constants.colors.primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      color: 'black',
      fontSize: 21,
      fontWeight: "600"
    },
    leftHeader: {
      position: 'absolute',
      left: 5,
      bottom: isTab || activeModal.includes('Set Up') ? 0 : 10
    },
    centerHeader:{
      position: 'absolute',
      alignItems:'center', 
      justifyContent:'center', 
      flexDirection:'column',
      bottom:isTab || activeModal.includes('Set Up') ? 0 : 10
    },
    rightHeader: {
      position: 'absolute',
      right: 5,
      bottom: isTab || activeModal.includes('Set Up') ? 0 : 10
    },
    leftIcon: {
      marginLeft:15,
    },
    circle:{
      borderRadius:20,
      borderColor:'black',
      borderWidth:1,
      width:35,
      height:35,
      backgroundColor:constants.colors.primaryColorButLighter,
      alignItems:'center',
      justifyContent:'center',
      marginRight:8,
      marginBottom:-5
    },
  });

  function icon(word){
    return (
        <View style={styles.circle}>
          <Text>{word}</Text>
        </View>
    )
  }

  var returnToModal = ''
  if(activeModal === 'Terms & Conditions' || activeModal === 'Privacy Policy'){
    if(!user)
      returnToModal = 'Sign Up'
    else
      returnToModal = 'Settings'
  }
  if(activeModal === 'Forgot Password')
    returnToModal = 'Login'
  if(isSetup)
    returnToModal = 'Set Up ' + type + ' Categories'
  
  return (
    <View style={styles.header}>

      <View style={styles.leftHeader}>
        { isTab &&
          <Foundation name='filter' size={28} onPress={() => props.navigation.toggleDrawer()}  style={styles.leftIcon}/>
        }
        { isModal &&
          <View style={{marginBottom:-5}}>
            <Button title='Back' color="black" onPress={() => {dispatch(setActiveModal(returnToModal));props.navigation.goBack()}} />
          </View>
        }
        {activeModal === 'Set Up Income Categories' && 
          <View style={{marginBottom:-5}}>
            <Button title='Back' color="black" onPress={() => {dispatch(setFilter('type', 'Expenses'));dispatch(setActiveModal('Set Up Expense Categories'))}} />
          </View>
        }
        { (isCard || ['Login', 'Sign Up', 'Forgot Password'].includes(activeModal)) &&
          <AntDesign name="arrowleft" size={24} color="black" style={{marginLeft:5, marginBottom:2}} onPress={() => {dispatch(setActiveModal(returnToModal));props.navigation.goBack()}}/>
        }
      </View>
      
      {activeModal.includes('Set Up') &&
        <View style={styles.centerHeader}>
          <Text style={styles.headerTitle}>Set Up</Text>
          <Text style={styles.headerTitle}>{activeModal.includes('Expense') ? 'Expense ' : 'Income '} Categories</Text>
        </View>
      }
      {!activeModal.includes('Set Up') &&
        <View style={styles.centerHeader}>
          <Text style={styles.headerTitle}>{title ? title : isTab ? type + ' ' + activeTab : activeModal}</Text>
        </View>
      }
      
      
      <View style={styles.rightHeader}>
        {['Filter By Amount', 'Filter By Description'].includes(title) &&
          <View style={{marginBottom:-5}}>
            <Button title='Save' color="black" onPress={() => {dispatch(saveForm());dispatch(setActiveModal(returnToModal));props.navigation.goBack()}} />
          </View>
        }
        {activeModal === 'Set Up Expense Categories' && 
          <View style={{marginBottom:-5}}>
            <Button title='Next' color="black" onPress={() => {dispatch(setFilter('type', 'Income'));dispatch(setActiveModal('Set Up Income Categories'));props.navigation.navigate('setUpIncome')}} />
          </View>
        }
        {activeModal === 'Set Up Income Categories' && 
          <View style={{marginBottom:-5}}>
            <Button title='Finish' color="black" onPress={() => {dispatch(setFilter('type', 'Expenses'));dispatch(finishSetup())}} />
          </View>
        }
        {isTab && 
          <TouchableOpacity onPress={() => {dispatch(setActiveModal('Settings'));props.navigation.navigate('Settings')}}>
            {icon(initials)}
          </TouchableOpacity>
        }
      </View>

    </View>
  ); 
};

export default Header;
