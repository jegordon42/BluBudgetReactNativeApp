import React from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity, TouchableHighlight, Alert} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as constants from '../../Constants'
import BulletChart from '../../Components/Charts/BulletChart';
import { useSelector, useDispatch } from 'react-redux';
import {selectCategory, deleteCategory} from '../../Store/Actions'
import CustomFetch from '../../CustomFetch';

function CategoryBox(props){
  const item = props.categoryId === -1 ? props.category : useSelector((state) => state.categoryDictionary[props.categoryId]) 
  const planned = item.Planned * props.budgetMonths
  const transactions = useSelector((state) => state.filters.type == 'Expenses' ? state.expenseTransactions : state.incomeTransactions)
  const dispatch = useDispatch()
  
  function openCategory(){
    dispatch(selectCategory(props.categoryId));
    props.navigation.navigate('EditCategory')
  }

  function deleteItem(){
    for(var i = 0; i < transactions.length; i++){
      if(transactions[i].CategoryId === props.categoryId){
        Alert.alert("Can't Delete.", "This category is used by one or more transactions.")
        return
      }
    }
    CustomFetch('DeleteCategory', {categoryId: props.categoryId})
    .then(result => {
        if(result['message'] === 'Success'){
            dispatch(deleteCategory(props.categoryId))
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

  function Box(){
    return (
      <View style={styles.category}>
        <View style={styles.labelChartContainer}>
          <View style={{flexDirection:'row', alignItems:'flex-end', marginBottom:10}}>
            {icon(item.CategoryName[0])}
            <Text style={styles.label}>{item.CategoryName}</Text>
          </View>
          <BulletChart barValue={item.amountSpent} barGoal={planned}/>
          <View style={{marginTop:5}}>
            <Text>${Math.abs(item.amountSpent - planned).toFixed(2)}{item.amountSpent <= planned ? ' remaining of ' : ' over '}${planned.toFixed(2)} Goal</Text>
          </View>
        </View>
        <View style={styles.spentContainer}>
          <Text style={{fontWeight:'600', fontSize:20}}>${item.amountSpent.toFixed(0)}</Text>
          <Text style={{fontSize:12}}>Spent</Text>
        </View>
      </View>
    )
  }
    
  

  if(props.categoryId === -1)
    return <Box/>
  else   
    return (
      <Swipeable renderRightActions={rightSwipe}>
        <TouchableHighlight onPress={openCategory}>
          {Box()}
        </TouchableHighlight>
      </Swipeable>
    )
}

export default CategoryBox;

const styles = StyleSheet.create({
  category: {
    backgroundColor: 'white',
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 0.25,
    borderBottomColor:'black',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
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
  labelChartContainer:{
    flex:7,
    textAlign:'left'
  },
  label:{
    fontWeight:'600',
    marginBottom:5
  },
  spentContainer:{
    flex:2,
    flexDirection:'column',
    alignItems:'center'
  },
  valueContainer:{
    flexDirection:'row',
    alignItems:'flex-end',
    justifyContent:'space-between'
  },
  deleteBox:{
    backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center',
    width:100,
    height:'100%'
  }
});
