import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../../Components/Common/Button';
import CurrencyInput from 'react-native-currency-input';
import * as constants from '../../Constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from 'react-native-woodpicker';
import { saveTransaction } from '../../Store/Actions';
import CustomFetch from '../../CustomFetch';
import { AntDesign } from '@expo/vector-icons';

const EditTransaction = ({ navigation }) => {
    const transaction = useSelector(state => state.selectedTransaction)
    const [description, setDescription] = useState(transaction.Description);
    const [amount, setAmount] = useState(transaction.Amount);
    const [date, setDate] = useState(new Date(transaction.Date));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const filterType = useSelector(state => state.filters.type);
    const [type, setType] = useState(filterType);
    const categories = useSelector(state => type === 'Expenses' ? state.expenseCategories : state.incomeCategories );
    const categoryDict = useSelector(state => state.categoryDictionary );
    const [category, setCategory] = useState({label: categoryDict[transaction.CategoryId].CategoryName, value: transaction.CategoryId });
    const dispatch = useDispatch();

    const getCategoryList = () => {
        let categoryList = []; 
        categories.forEach( ( category ) => {
            categoryList.push({ label: category.CategoryName, value: category.CategoryId })
        })
        return categoryList;
    };

    function save() {
        if(description == ''){
            Alert.alert('Please Enter a Description')
            return
        } 
        if(amount == 0 || !amount){
            Alert.alert('Please Enter an Amount')
            return
        }   
        var updatedTransaction = {
            TransactionId : transaction.TransactionId,
            transactionType: type.replace('es', 'e'),
            Description : description,
            CategoryId : category['value'],
            Amount : amount,
            Date: date.toLocaleDateString()
        }
        CustomFetch('UpdateTransaction', {transaction: updatedTransaction})
        .then(result => {
            if(result['message'] === 'Success'){
                dispatch(saveTransaction(updatedTransaction))
                navigation.goBack()
            } else {
                console.log('Error Updating Transaction')
            }   
        })
        .catch(e => {
            console.log(e);
        });
    }
    
    return (
        <View>
            <TouchableHighlight underlayColor={constants.colors.primaryColorButLighter}>
                <View style={styles.item}>
                    <Text style={styles.itemText}>Description</Text>
                    <TextInput 
                        style={ styles.textContainer } 
                        placeholder="Description"
                        value={description}
                        onChangeText={(description) => setDescription(description)}
                    />
                </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={constants.colors.primaryColorButLighter} onPress={() => setShowDatePicker(true)}>
                <View style={styles.item}>
                    <Text style={styles.itemText}>Date</Text>
                        <View>
                            <View style={styles.rowWithArrow}>
                                <Text>{constants.formatDate(date)}</Text>
                                <DateTimePickerModal
                                    isVisible={showDatePicker}
                                    date={date}
                                    mode='date'
                                    onConfirm={ (newDate) => { setDate(newDate), setShowDatePicker(false) }}
                                    onCancel={() => setShowDatePicker(false)}
                                />
                                <AntDesign style={{marginLeft:5}} name="right" size={15} color={'black'} />
                            </View>
                        </View>
                </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={constants.colors.primaryColorButLighter}> 
                <View style={styles.item}>
                    <Text style={styles.itemText}>Category</Text>
                    <View style={styles.rowWithArrow}>
                        <Picker
                            item={category}
                            items={getCategoryList()}
                            onItemChange={setCategory}
                            title="Category"
                            placeholder="Select Category"
                        />
                        <AntDesign style={{marginLeft:5}} name="right" size={15} color={'black'} />
                    </View>
                </View>
                </TouchableHighlight>
            <View style={styles.item}>
                <Text style={styles.itemText}>Amount</Text>
                <CurrencyInput
                    style={ styles.textContainer } 
                    value={amount === 0 ? '' : amount}
                    onChangeValue={(value) => setAmount(value)}
                    prefix="$"
                    delimiter=","
                    separator="."
                    precision={2}
                    placeholder="Amount"
                    maxValue={1000000}
                >
                </CurrencyInput>
            </View>
            <View style={styles.buttonContainer}>
                <Button 
                    title="Save" 
                    textColor="white" 
                    style={styles.button}
                    backgroundColor={constants.colors.primaryColor} 
                    onPress={save}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        height: 60,
        padding: 10,
        fontSize: 18,
        borderBottomWidth: 0.25,
        borderBottomColor: 'grey',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowWithArrow:{
        flexDirection:'row', 
        alignItems:'center'
      },
    header: {
        backgroundColor: constants.colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 90,
        paddingTop: 50,
        paddingBottom: 10,
        paddingRight: 20,
        paddingLeft: 20
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10
    },
    buttonContainer:{
        alignItems:'center'
    },
    button :{
        width:'50%',
        marginTop:25
    }
});

export default EditTransaction
