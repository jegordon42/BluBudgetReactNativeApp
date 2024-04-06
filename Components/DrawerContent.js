import * as React from 'react';
import { useState } from 'react';
import { setFilter, setActiveModal, setForm } from '../Store/Actions';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import * as constants from '../Constants'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from 'react-native-woodpicker';
import { FontAwesome } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DrawerContent({navigation}) {
  const activeTab = useSelector(state => state.activeTab)
  const filters = useSelector(state => state.filters)
  const type = useSelector(state => state.filters.type)
  const amount = useSelector(state => state.filters.amount)
  const description = useSelector(state => state.filters.description)
  const categories = useSelector(state => type === 'Expenses' ? state.expenseCategories : state.incomeCategories)
  const selectedCategories = useSelector(state => type === 'Expenses' ? state.filters.expenseCategories : state.filters.incomeCategories)
  const [showDatePicker, setShowDatePicker] = useState('')
  const [sort, setSort] = useState({label:'Name', value:'Name'})
  const forceRerenderKey = useSelector(state => state.forceRerenderKey)
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    drawerContainer:{
      backgroundColor:constants.colors.backgroundColor,
      height:1000
    },
    rowWithArrow:{
      flexDirection:'row', 
      alignItems:'center'
    },
    header: {
      backgroundColor: constants.colors.primaryColor,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection:'row',
      height: 43 + insets.top,
      paddingTop:insets.top + 5,
      paddingBottom:10,
      paddingRight:20,
      paddingLeft:20
    },
    title: {
      fontSize: 21,
      fontWeight: "600"
    },
    filterContainer:{
      paddingLeft:5,
      paddingRight:5,
      borderBottomWidth:1,
      borderBottomColor:'grey'
    },
    filterRow:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      height:50
    },
    filterRow2:{
      flexDirection:'row',
      justifyContent:'flex-end',
      marginTop:-10,
      marginBottom:10
    },
    filterLabel:{
      fontSize: 18,
      marginRight:10
    },
    filterValue:{
      color:constants.colors.primaryColor,
      fontSize: 18
    },
    filtersContainer: {
      backgroundColor:'white'
    }
  });

  function openFilter(filter){
    if(filter === 'Filter By Amount')
      dispatch(setForm(amount ? amount : {comparator: {label:'Equals', value:'Equals'}, value:0}))
    if(filter === 'Filter By Description')
      dispatch(setForm(description ? description : {comparator: {label:'Equals', value:'Equals'}, value:''}))
    dispatch(setActiveModal(filter));
    navigation.navigate(filter)
  }

  return (
      <View style={styles.drawerContainer} key={forceRerenderKey}>
        <View style={styles.header}>
          <Ionicons onPress={() => dispatch(setFilter('reset', null))}name="refresh-sharp" size={27} color="black" />
          <Text style={styles.title}>Filters</Text>
          <FontAwesome onPress={() => openFilter('Filter By Date')} name="calendar" size={24} color="black" />
        </View>
        <View style={styles.filtersContainer}>
          <TouchableHighlight onPress={()=>setShowDatePicker('startDate')} underlayColor={constants.colors.primaryColorButLighter}>
            <View style={styles.filterContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Start Date</Text>
                <View style={styles.rowWithArrow}>
                  <Text style={styles.filterValue}>{constants.formatDate(filters.startDate)}</Text>
                  <DateTimePickerModal 
                    isVisible={showDatePicker === 'startDate'} 
                    date={filters.startDate} 
                    mode='date' 
                    onConfirm={(date) => {dispatch(setFilter('startDate', date)); setShowDatePicker('')}}
                    onCancel={() => setShowDatePicker('')}
                  />
                  <AntDesign style={{marginLeft:5}} name="right" size={15} color={constants.colors.primaryColor} />
                </View>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>setShowDatePicker('endDate')} underlayColor={constants.colors.primaryColorButLighter}>
            <View style={styles.filterContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>End Date</Text>
                <View style={styles.rowWithArrow}>
                  <Text style={styles.filterValue}>{constants.formatDate(filters.endDate)}</Text>
                  <DateTimePickerModal 
                    isVisible={showDatePicker === 'endDate'} 
                    date={filters.endDate} 
                    mode='date' 
                    onConfirm={(date) => {dispatch(setFilter('endDate', date)); setShowDatePicker('')}}
                    onCancel={() => setShowDatePicker('')}
                  />
                  <AntDesign style={{marginLeft:5}} name="right" size={15} color={constants.colors.primaryColor} />
                </View>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>dispatch(setFilter('type', type === 'Expenses' ? 'Income' : 'Expenses'))} underlayColor={constants.colors.primaryColorButLighter}>
            <View style={styles.filterContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Type</Text>
                <View style={styles.rowWithArrow}>
                    <Text style={styles.filterValue}>{type}</Text>
                    <AntDesign style={{marginLeft:5}} name="right" size={15} color={constants.colors.primaryColor} />
                </View>
              </View> 
            </View>
          </TouchableHighlight>
          {activeTab === 'Transactions' && 
            <>
              <TouchableHighlight onPress={() => openFilter('Filter By Category')} underlayColor={constants.colors.primaryColorButLighter}>
                <View style={styles.filterContainer}>
                  <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Categories</Text>
                    <View style={styles.rowWithArrow}>
                      <Text style={styles.filterValue}>{categories.length === selectedCategories.length ? 'All' : selectedCategories.length + ' Selected'}</Text>
                      <AntDesign style={{marginLeft:5}} name="right" size={15} color={constants.colors.primaryColor} />
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            </>
          }
          <TouchableHighlight onPress={() => openFilter('Filter By Amount')} underlayColor={constants.colors.primaryColorButLighter}>
            <View style={styles.filterContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Amount</Text>
                <View style={styles.rowWithArrow}>
                  <Text style={styles.filterValue}>{!amount ? 'All' : amount.comparator.value}</Text>
                  <AntDesign style={{marginLeft:5}} name="right" size={15} color={constants.colors.primaryColor} />
                </View>
              </View>
              {amount && 
                <View style={styles.filterRow2}>
                  <Text style={styles.filterValue}>${amount.comparator.value !== 'In Range' ? amount.value : amount.value.valueFrom + ' - $' + amount.value.valueTo}</Text>
                </View>
              }
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => openFilter('Filter By Description')} underlayColor={constants.colors.primaryColorButLighter}>
            <View style={styles.filterContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Description</Text>
                <View style={styles.rowWithArrow}>
                  <Text style={styles.filterValue}>{!description ? 'All' : description.comparator.value}</Text>
                  <AntDesign style={{marginLeft:5}} name="right" size={15} color={constants.colors.primaryColor} />
                </View>
              </View>
              {description && 
                <View style={styles.filterRow2}>
                  <Text style={styles.filterValue}>"{description.value}"</Text>
                </View>
              }
            </View>
          </TouchableHighlight>
          {/* <View style={{height:30, backgroundColor:constants.colors.backgroundColor, borderBottomWidth:0,borderBottomColor:'grey'}}/>
          <View style={styles.filterContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <Picker
                  item={sort}
                  items={[{label:'Name', value:'Name'}, {label:'Amount Spent', value:'Amount Spent'}]}
                  onItemChange={(item)  => setSort(item)}
                  title="Comparator"
                  textInputStyle={{textAlign:'right', color:constants.colors.primaryColor}}
                  containerStyle={{flex:1}}
              />
            </View>
          </View> */}
        </View>
      </View>
  );
}