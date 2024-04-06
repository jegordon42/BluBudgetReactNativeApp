import * as React from 'react';
import { useState } from 'react';
import { setFilter, setActiveTab, setForm } from '../../Store/Actions';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import * as constants from '../../Constants'
import { DrawerContentScrollView } from '@react-navigation/drawer';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function BulletChart(props) {
  const barValue = props.barValue
  const barGoal = props.barGoal
  
  const borderRad = 0
  const forceRerenderKey = useSelector(state => state.forceRerenderKey)
  const dispatch = useDispatch()

  const styles = StyleSheet.create({
    bar: {
      flexDirection:'row',
      borderStyle:'solid',
      borderColor:'black',
      backgroundColor: barValue < barGoal ? '#e3ffe0' : '#ffd6d7',
      height: 10,
      borderRadius:borderRad
    },
    filledBar:{
      backgroundColor: constants.colors.primaryColor,
      flex: barValue < barGoal ? (barValue/barGoal) * 100 : (barGoal/barValue) * 100,
      borderTopRightRadius: barValue < barGoal ? borderRad : 0,
      borderBottomRightRadius: barValue < barGoal ? borderRad : 0,
      borderTopLeftRadius: borderRad,
      borderBottomLeftRadius: borderRad
    },
    beforeGoalBar:{
      backgroundColor: '#e3ffe0',
      flex:100-((barValue/barGoal) * 100),
      borderTopRightRadius: borderRad,
      borderBottomRightRadius: borderRad
    },
    filledAfterGoalBar:{
      backgroundColor: '#FF0F0F',
      flex: 100 - ((barGoal/barValue) * 100),
      borderTopRightRadius: borderRad,
      borderBottomRightRadius: borderRad
    },
    endBar:{
      backgroundColor: '#ffd6d7',
      flex:15,
      borderTopRightRadius:borderRad,
      borderBottomRightRadius:borderRad
    },
    tick:{
      borderRightColor:'black',
      borderRightWidth:1,
      height:14,
      marginTop:-2
    }
  });

  if(barValue < barGoal)
    return (
      <View>
        <View style={styles.bar}>
          <View style={styles.filledBar}/>
          <View style={styles.beforeGoalBar}></View>
          {/* <View style={styles.tick}></View>
          <View style={styles.endBar}></View> */}
        </View>
      </View>
    );
  else
    return (
      <View>
        <View style={styles.bar}>
          <View style={styles.filledBar}/>
          <View style={styles.tick}></View>
          <View style={styles.filledAfterGoalBar}></View>
          {/* <View style={styles.endBar}></View> */}
        </View>
      </View>
      );
}


