import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { setFilter, setActiveModal } from '../../Store/Actions';
import { useSelector, useDispatch } from 'react-redux'; 
import * as constants from '../../Constants'
import { TouchableHighlight } from 'react-native-gesture-handler';

const FilterByDate = ({navigation}) => {
    const categoryType = useSelector(state => state.filters.type) 
    const forceRerenderKey = useSelector(state => state.forceRerenderKey) 
    const dateOptions = ['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Last 3 Months', 'This Year', 'Last Year']
    const dispatch = useDispatch();

    function onSelectDateOption(dateOption){
        var startDate = new Date(); 
        var endDate = new Date();
        
        if(dateOption === 'Last 7 Days')
            startDate.setDate(startDate.getDate() - 6)
        else if(dateOption === 'Last 14 Days')
            startDate.setDate(startDate.getDate() - 13)
        else if(dateOption === 'Last 30 Days')
            startDate.setDate(startDate.getDate() - 29)
        else if(dateOption === 'This Month')
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
        else if(dateOption === 'Last Month'){
            startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1)
            endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
            endDate.setDate(endDate.getDate() - 1)
        }
        else if(dateOption === 'Last 3 Months')
            startDate = new Date((new Date()).getFullYear(), (new Date()).getMonth() - 2, 1)
        else if(dateOption === 'This Year')
            startDate = new Date(startDate.getFullYear(), 0, 1)
        else if(dateOption === 'Last Year'){
            startDate = new Date(startDate.getFullYear() - 1, 0, 1)
            endDate = new Date(endDate.getFullYear() - 1, 11, 31)
        }

        dispatch(setFilter('date', {startDate, endDate}))
        dispatch(setActiveModal(''));
        navigation.goBack()
    }

    function renderListItem({item}){
        return (
            <TouchableHighlight onPress={()=>onSelectDateOption(item)} underlayColor={constants.colors.primaryColorButLighter}>
                <View style={styles.item}>
                    <Text style={styles.itemText}>{item}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    return (
        <View>
            <FlatList
                data={dateOptions}
                keyExtractor={(item) => item}
                renderItem={renderListItem}
            />
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
        alignItems: 'center'
    },
    itemText:{
        fontSize:16,
        fontWeight:'500'
    }
  });

export default FilterByDate
