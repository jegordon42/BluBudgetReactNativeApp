import React from 'react';
import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { setForm } from '../../Store/Actions';
import { useSelector, useDispatch } from 'react-redux'; 
import * as constants from '../../Constants'
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Picker } from 'react-native-woodpicker';

const FilterByDescription = ({navigation}) => {
    const currentDescription = useSelector(state => state.filters.description ? state.filters.description : {comparator: {label:'Equals', value:'Equals'}, value:''}) 
    const compareOptions = [{label:'None', value:'None'}, {label:'Equals', value:'Equals'}, {label:'Not Equal To', value:'Not Equal To'}, {label:'Contains', value:'Contains'}, {label:'Does Not Contain', value:'Does Not Contain'}, {label:'Starts With', value:'Starts With'}, {label:'Ends With', value:'Ends With'}]
    const [comparator, setComparator] = useState(currentDescription.comparator)
    const [value, setValue] = useState(currentDescription.value)
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
            form['value'] = value
        }
        else if(formControl === 'value'){
            setValue(formControlValue)
            form['comparator'] = comparator
            form['value'] = formControlValue
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
                    onItemChange={(item) => updateForm('comparator', item)}
                    title="Comparator"
                    textInputStyle={{textAlign:'right'}}
                    containerStyle={{flex:1}}
                />
            </View>
            {comparator.value !== 'None' &&
                <View style={styles.item}>
                    <Text style={styles.itemText}>Value</Text>
                    <TextInput
                        style={{height: 40, flex:1, textAlign:'right'}}
                        placeholder="Type your filter here!"
                        defaultValue={value}
                        onChangeText={text => updateForm('value', text)}
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

export default FilterByDescription
