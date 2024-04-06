import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveModal } from '../../Store/Actions';
import { Text, View, SectionList, StyleSheet, Dimensions } from 'react-native'
import Card from '../../Components/Common/Card'
import TransactionsBarChart from '../../Components/Charts/TransactionsBarChart';
import TransactionBox from './TransactionBox';
import * as constants from '../../Constants'
import { FloatingAction } from "react-native-floating-action";
import { LogBox } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

//So we can pass floating action reference through navigation
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function Transactions({navigation}) {
  const noTransactions = useSelector(state => state.filters.type === 'Expenses' ? state.expenseTransactions.length === 0 : state.incomeTransactions.length === 0)
  const noCategories = useSelector(state => state.filters.type === 'Expenses' ? state.expenseCategories.length === 0 : state.incomeCategories.length === 0)
  const transactions = useSelector(state => state.filters.type === 'Expenses' ? state.filteredExpenseTransactions : state.filteredIncomeTransactions) 
  const startDate = useSelector(state => state.filters.startDate)
  const endDate = useSelector(state => state.filters.endDate)
  const forceRerenderKey = useSelector(state => state.forceRerenderKey);
  var floatingActionButton;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  var transactionList = {
    height: SCREEN_HEIGHT * 5/7 - 180 - insets.top - insets.bottom
  }


  var total = 0
  transactions.forEach(transaction => {
    total += transaction.Amount
  });

  function getTransactionSections(){
    var sections = []
    var curDate = null
    var curIndex = -1
    for(var i = 0; i < transactions.length; i++){
      if(curDate === null || transactions[i]['Date'] !== curDate){
        curDate = transactions[i]['Date']
        sections.push({'date' : curDate, 'total' : 0, 'data' : []})
        curIndex++;
      }
      sections[curIndex]['total'] += transactions[i]['Amount']
      sections[curIndex]['data'].push(transactions[i])
    }
    return sections
  }

  function renderListHeader({section}){
    return (
      <View style={styles.ListHeader}>
        <Text style={{fontWeight:'600',color:'#484848', fontSize: 13}}>{new Date(section['date']).toString().substr(0,15).toUpperCase()}</Text>
        <Text style={{fontWeight:'700',color:'#484848', fontSize: 18}}>${section['total'].toFixed(2)}</Text>
      </View>
    )
  }
   
  return (
    <View style={styles.transactionPage} key={forceRerenderKey} >
      <View style={{height:25,backgroundColor:constants.colors.primaryColor, flexDirection:'column', alignItems:'center'}}>
        <Text >{startDate.toLocaleDateString('en-us', dateFormat)} - {endDate.toLocaleDateString('en-us', dateFormat)}</Text>
      </View>
      <View style={{height:40,backgroundColor:constants.colors.primaryColor, flexDirection:'row', justifyContent:'space-between'}}>
        <View style={{flexDirection:'column', alignItems:'center', borderRightColor:'black', borderRightWidth:1, flex:1, height:35}}>
            <Text>${total.toFixed(2)}</Text>
            <Text>Total</Text>
        </View>
        <View style={{flexDirection:'column', alignItems:'center', borderRightColor:'black', borderRightWidth:1, flex:1, height:35}}>
            <Text>{transactions.length}</Text>
            <Text>Transactions</Text>
        </View>
        <View style={{flexDirection:'column', alignItems:'center', flex:1}}>
            <Text>{((endDate.getTime() - startDate.getTime()) / oneDay).toFixed(0)}</Text>
            <Text>Days</Text>
        </View>
      </View>
      {noCategories && 
        <View style={{height:'50%',justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.text}>You have no categories,</Text>
          <Text style={styles.text}>create some to get started!</Text>
        </View>
      }
      {!noCategories && noTransactions && 
        <View style={{height:'50%',justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.text}>You have no transactions,</Text>
          <Text style={styles.text}>create some to get started!</Text>
        </View>
      }
      {!noTransactions && transactions.length === 0 &&
        <View style={{height:'50%',justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.text}>There are no transactions</Text>
          <Text style={styles.text}>for the filters specified.</Text>
          <Text style={{...styles.text, marginTop:40}}>Modify the filters or </Text>
          <Text style={styles.text}>create some more transactions!</Text>
        </View>
      }
      {transactions.length > 0 &&
        <>
          <Card style={styles.chart}><TransactionsBarChart/></Card>
          <View style={transactionList}>
            <SectionList
              style={styles.dayList}
              sections={getTransactionSections()}
              keyExtractor={(item, index) => item + index}
              renderSectionHeader = {renderListHeader}
              renderItem={({item, index}) => {
                return <TransactionBox item={item} navigation={navigation}/>;
              }}
            />
          </View>
        </>
      }
      {!noCategories &&
        <FloatingAction 
        style={styles.addButtonStyle} 
        ref={(ref) => floatingActionButton = ref}
        onPressMain={ () => {
          dispatch(setActiveModal('New Transaction'))
          navigation.navigate('AddTransactionScreen', {floatingActionButton : floatingActionButton})
        }}
        />
      }
    </View>
  );
}

const dateFormat = {month:"long", day:"numeric", year:"numeric"}
var oneDay = 1000 * 60 * 60 * 24

const styles = StyleSheet.create({
  ListHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingTop: 5,
    paddingRight: 10,
    paddingLeft:10,
    paddingBottom:5,
    backgroundColor:constants.colors.primaryColorButLighter
  },
  chart: {
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight:5,
    paddingBottom:5,
    marginTop: 10
  },
  text:{
    fontSize:20,
    fontWeight:'600',
    textAlign:'center'
  },
  transactionPage: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    width:SCREEN_WIDTH,
    backgroundColor:constants.colors.backgroundColor
  },
  dayList:{
    backgroundColor:'white',
    marginTop:10
  },
  addButtonStyle: {
    marginTop: 150
  }
});

export default Transactions;