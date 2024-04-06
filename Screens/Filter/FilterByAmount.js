import React from 'react';
import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { setFilter, setActiveTab, setForm } from '../../Store/Actions';
import { useSelector, useDispatch } from 'react-redux'; 
import * as constants from '../../Constants'
import { Picker } from 'react-native-woodpicker';
import CurrencyInput from 'react-native-currency-input';

const FilterByAmount = ({navigation}) => {
    const currentAmount = useSelector(state => state.filters.amount ? state.filters.amount : {comparator: {label:'Equals', value:'Equals'}, value:0}) 
    const compareOptions = [{label:'None', value:'None'}, {label:'Equals', value:'Equals'}, {label:'Not Equal To', value:'Not Equal To'}, {label:'Less Than', value:'Less Than'}, {label:'Less Than Or Equal To', value:'Less Than Or Equal To'}, {label:'Greater Than', value:'Greater Than'}, {label:'Greater Than Or Equal To', value:'Greater Than Or Equal To'}, {label:'In Range', value:'In Range'}]
    const [comparator, setComparator] = useState(currentAmount.comparator)
    const [value, setValue] = useState(comparator.value === 'In Range' ? currentAmount.value.valueFrom : currentAmount.value)
    const [value2, setValue2] = useState(comparator.value === 'In Range' ? currentAmount.value.valueTo : 0)
    const dispatch = useDispatch();

    function updateForm(formControl, formControlValue){
        var form = {}
        if(formControl === 'comparator'){
            setComparator(formControlValue)
            if(formControlValue.value === 'None'){
                dispatch(setForm(null))
                return
            }    
            form['comparator'] = formControlValue
            if(formControlValue.value === 'In Range')
                form['value'] = {valueFrom: value, valueTo: value2}
            else 
                form['value'] = value
        }
        else if(formControl === 'value'){
            setValue(formControlValue)
            form['comparator'] = comparator
            if(comparator.value === 'In Range')
                form['value'] = {valueFrom: formControlValue, valueTo: value2}
            else 
                form['value'] = formControlValue
        }
        else if(formControl === 'value2'){
            setValue2(formControlValue)
            form['comparator'] = {label:'In Range', value:'In Range'}
            form['value'] = {valueFrom: value, valueTo: formControlValue}
        }
        dispatch(setForm(form))
    }

    return (
        <View>
                <View style={styles.item}>
                    <Text style={styles.itemText}>Comparator</Text>
                    <Picker
                        item={comparator}
                        items={compareOptions}
                        onItemChange={(item)  => updateForm('comparator', item)}
                        title="Comparator"
                        textInputStyle={{textAlign:'right'}}
                        containerStyle={{flex:1}}
                    />
                </View>
                {comparator.value !== 'None' && 
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{comparator.value === 'In Range' ? 'From Value' : 'Value'}</Text>
                        <CurrencyInput
                            value={value}
                            style={{height: 40, flex:1, textAlign:'right'}}
                            placeholder="Type your filter here!"
                            prefix="$"
                            delimiter=","
                            separator="."
                            precision={2}
                            onChangeValue={(val) => updateForm('value', val)}
                        />
                    </View>
                }
                {comparator.value === 'In Range' && 
                    <View style={styles.item}>
                        <Text style={styles.itemText}>To Value</Text>
                        <CurrencyInput
                            value={value2}
                            style={{height: 40, flex:1, textAlign:'right'}}
                            placeholder="Type your filter here!"
                            prefix="$"
                            delimiter=","
                            separator="."
                            precision={2}
                            onChangeValue={(val) => updateForm('value2', val)}
                        />
                    </View>
                }
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
        justifyContent: 'space-between'
    },
    itemText:{
        fontSize:16,
        fontWeight:'500',
        marginRight:10
    }
  });

export default FilterByAmount
