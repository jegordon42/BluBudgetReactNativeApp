import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTransaction, deleteTransaction } from '../../Store/Actions';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Text, View, StyleSheet, Animated, TouchableOpacity, TouchableHighlight } from 'react-native'
import * as constants from '../../Constants'
import CustomFetch from '../../CustomFetch';

function TransactionBox(props){
  const categories = useSelector((state) => state.categoryDictionary) 
  const dispatch = useDispatch();
  
  function openTransaction(){
    dispatch(selectTransaction(props.item));
    props.navigation.navigate('EditTransaction')
  }

  function deleteItem(){
    CustomFetch('DeleteTransaction', {transactionId: props.item.TransactionId})
    .then(result => {
        if(result['message'] === 'Success'){
            dispatch(deleteTransaction(props.item.TransactionId))
        } else {
            console.log('Error Deleting Category')
        }   
    })
    .catch(e => {
        console.log(e);
    });
  }

  function icon(letter){
    return (
      <View style={styles.iconContainer}>
        <View style={styles.circle}>
          <Text>{letter}</Text>
        </View>
      </View>
    )
  }

  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={deleteItem}>
        <View style={styles.deleteBox}>
          <Animated.Text style={{transform: [{scale}]}}>Delete</Animated.Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Swipeable renderRightActions={rightSwipe}>
      <TouchableHighlight onPress={openTransaction}>
        <View style={styles.listItem}>
          <View>{icon(categories[props.item.CategoryId].CategoryName[0])}</View>
          <View style={{textAlign:'left', flex:1}}>
            <Text style={{fontSize:17}}>{props.item.Description}</Text>
            <Text style={{fontSize:12}}>{categories[props.item.CategoryId].CategoryName}</Text>
          </View>
          <View  style={{textAlign:'right'}}>
            <Text style={{fontSize:18}}>{constants.formatMoney(props.item.Amount)}</Text>
          </View>
        </View>
      </TouchableHighlight>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 0.25,
    borderBottomColor:'grey',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'white'
  },
  iconContainer:{
    width:40
  },
  circle:{
    borderRadius:20,
    borderColor:'black',
    borderWidth:1,
    width:30,
    height:30,
    backgroundColor:constants.colors.primaryColorButLighter,
    alignItems:'center',
    justifyContent:'center'
  },
  deleteBox:{
    backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center',
    width:65,
    height:'100%'
  }
});

export default TransactionBox;