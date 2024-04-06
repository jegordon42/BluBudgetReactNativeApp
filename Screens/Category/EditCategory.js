import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { saveCategory } from '../../Store/Actions';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../Components/Common/Button';
import * as constants from '../../Constants'
import CustomFetch from '../../CustomFetch';

const EditCategory = ({navigation}) => {
    const categoryId = useSelector(state => state.selectedCategoryId) 
    const category = useSelector(state => state.categoryDictionary[categoryId])
    const [categoryName, setCategoryName] = useState(category.CategoryName)
    const [planned, setPlanned] = useState(category.Planned)
    const dispatch = useDispatch();

    function save(){
        if(categoryName == ''){
            Alert.alert('Please Enter a Category Name')
            return
        } 
        if(planned == 0 || !planned){
            Alert.alert('Please Enter a Monthly Goal')
            return
        }   
        var updatedCategory = {
            'CategoryId' : categoryId,
            'CategoryName' : categoryName,
            'Planned' : planned,
            'amountSpent' : category.amountSpent
        }
        CustomFetch('UpdateCategory', {category: updatedCategory})
        .then(result => {
            if(result['message'] === 'Success'){
                dispatch(saveCategory(updatedCategory))
                navigation.goBack()
            } else {
                console.log('Error Updating Category')
            }   
        })
        .catch(e => {
            console.log(e);
        });
    }

    return (
        <View>
            <View style={styles.item}>
                <Text style={styles.itemText}>Name</Text>
                <TextInput
                    style={{height: 40, flex:1, textAlign:'right'}}
                    placeholder="Category Name"
                    defaultValue={categoryName}
                    onChangeText={text => setCategoryName(text)}
                />
            </View>
            <View style={styles.item}>
                <Text style={styles.itemText}>Monthly Goal</Text>
                <CurrencyInput
                    value={planned === 0 ? '' : planned}
                    style={{height: 40, flex:1, textAlign:'right'}}
                    placeholder="Monthly Goal"
                    prefix="$"
                    delimiter=","
                    separator="."
                    precision={2}
                    onChangeValue={(val) => setPlanned(val)}
                />
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
    },
    button :{
        width:'50%',
        marginTop:25
    },
    buttonContainer:{
        alignItems:'center'
    },
  });

export default EditCategory
