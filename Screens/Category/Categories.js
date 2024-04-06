import React from 'react';
import { useState } from 'react';
import { setActiveModal } from '../../Store/Actions';
import { SafeAreaView, Text, View, FlatList, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import CategoryBox from './CategoryBox';
import { FloatingAction } from "react-native-floating-action";
import { LogBox } from 'react-native';
import * as constants from '../../Constants'

//So we can pass floating action reference through navigation
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function Categories({navigation}) {
  const type = useSelector(state => state.filters.type)
  const categories = useSelector(state => type == 'Expenses' ? state.expenseCategories : state.incomeCategories)
  const noCategories = useSelector(state => type === 'Expenses' ? state.expenseCategories.length === 0 : state.incomeCategories.length === 0)
  const forceRerenderKey = useSelector(state => state.forceRerenderKey);
  const startDate = useSelector(state => state.filters.startDate)
  const endDate = useSelector(state => state.filters.endDate)
  const isSetup = useSelector(state => state.isSetup)
  var floatingActionButton;
  const dispatch = useDispatch();

  var budgetMonths= (endDate.getFullYear() - startDate.getFullYear()) * 12;
  budgetMonths -= startDate.getMonth();
  budgetMonths += endDate.getMonth();
  budgetMonths++;

  var totalPlanned = 0
  var totalSpent = 0
  categories.forEach(category => {
    totalPlanned += category.Planned
    totalSpent += category.amountSpent
  });
  totalPlanned = totalPlanned * budgetMonths

  var categoryList = [{
    CategoryId : -1,
    CategoryName: "Total Budget",
    Planned: totalPlanned,
    amountSpent: totalSpent
  }]
  categoryList = categories//categoryList.concat(categories)
  
  return (
    <SafeAreaView style={styles.container} key={forceRerenderKey}>
      {!isSetup &&
        <>
          <View style={{height:25,backgroundColor:constants.colors.primaryColor, flexDirection:'column', alignItems:'center'}}>
            <Text >Showing Budget For {budgetMonths} Month{budgetMonths === 1 ? '' : 's'}</Text>
          </View>
          <View style={{height:40,backgroundColor:constants.colors.primaryColor, flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{flexDirection:'column', alignItems:'center', borderRightColor:'black', borderRightWidth:1, flex:1, height:35}}>
                <Text>${totalSpent.toFixed(2)}</Text>
                <Text>Total {type === 'Income' ? '' : 'Spent'}</Text>
            </View>
            <View style={{flexDirection:'column', alignItems:'center', borderRightColor:'black', borderRightWidth:1, flex:1, height:35}}>
                <Text>${totalPlanned.toFixed(2)}</Text>
                <Text>Total Planned</Text>
            </View>
            <View style={{flexDirection:'column', alignItems:'center', flex:1, height:35}}>
                <Text>${(totalPlanned - totalSpent).toFixed(2)}</Text>
                <Text>{totalPlanned > totalSpent ? 'Remaining' : 'Over'}</Text>
            </View>
          </View>
        </> 
      }
      {isSetup && 
        <View style={{height:10,backgroundColor:constants.colors.primaryColor, flexDirection:'column', alignItems:'center'}}></View>
      }
      {noCategories && 
        <View style={{height:'50%',justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.text}>You have no categories,</Text>
          <Text style={styles.text}>create some to get started!</Text>
        </View>
      }
      {!noCategories &&
        <FlatList
        data={categoryList}
        keyExtractor={(item) => String(item.CategoryId)}
        renderItem={({item}) => <CategoryBox categoryId={item.CategoryId} category={item} budgetMonths={budgetMonths}  navigation={navigation}/>}
      />
      }
      <FloatingAction 
        style={styles.addButtonStyle} 
        ref={(ref) => floatingActionButton = ref}
        onPressMain={ () => {
          dispatch(setActiveModal('New Category'))
          navigation.navigate('AddCategoryScreen', {floatingActionButton : floatingActionButton})
        }}
        />
    </SafeAreaView>
  );
}

const dateFormat = {month:"long", day:"numeric", year:"numeric"}
var oneDay = 1000 * 60 * 60 * 24

const styles = StyleSheet.create({
    container : {
      flex:1
    },
    text:{
      fontSize:20,
      fontWeight:'600',
      textAlign:'center'
    },
    addButtonStyle: {
      marginTop: 150
    }
  });