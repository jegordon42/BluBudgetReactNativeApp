import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { setFilter, setActiveTab } from '../../Store/Actions';
import { useSelector, useDispatch } from 'react-redux';
import CircleCheckBox, {LABEL_POSITION} from 'react-native-circle-checkbox';  
import * as constants from '../../Constants'

const FilterByCategory = () => {
    const categoryType = useSelector(state => state.filters.type) 
    const categories = useSelector(state => categoryType === 'Expenses' ? state.expenseCategories : state.incomeCategories)
    const selectedCategories = useSelector(state => categoryType === 'Expenses' ? state.filters.expenseCategories : state.filters.incomeCategories)
    const forceRerenderKey = useSelector(state => state.forceRerenderKey) 
    const dispatch = useDispatch();

    function renderListItem({item}){
        return (
        <View style={styles.item} key={forceRerenderKey}>
            <View style={{textAlign:'left', flex:1, height:30}}>
                <CircleCheckBox
                    checked={selectedCategories.includes(item.CategoryId)}
                    onToggle={() => {dispatch(setFilter(categoryType === 'Expenses' ? 'expenseCategories' : 'incomeCategories', item.CategoryId))}}
                    labelPosition={LABEL_POSITION.RIGHT}
                    label={item.CategoryName}
                    outerColor={constants.colors.primaryColor}
                    innerColor={constants.colors.primaryColorButLighter}
                    styleLabel={{fontSize:18, marginLeft:10}}
                />
            </View>
        </View>
        )
    }

    return (
        <View>
            <FlatList
                data={categories}
                keyExtractor={(item) => String(item.CategoryId)}
                renderItem={renderListItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        height:50,
        padding: 10,
        fontSize: 18,
        borderBottomWidth: 0.25,
        borderBottomColor:'grey',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
  });

export default FilterByCategory
