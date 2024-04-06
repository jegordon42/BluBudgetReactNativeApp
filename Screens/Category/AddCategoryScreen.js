import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import { addCategory } from '../../Store/Actions';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../Components/Common/Button';
import * as constants from '../../Constants'
import CustomFetch from '../../CustomFetch';

const AddCategoryScreen = ({ route, navigation }) => { 
    const categoryType = useSelector(state => state.filters.type.replace('es', 'e')) 
    const [categoryName, setCategoryName] = useState('')
    const [planned, setPlanned] = useState(0)
    const dispatch = useDispatch();

    useEffect(() => {
        route.params.floatingActionButton.animateButton()
    }, []);

    function add(){
        if(categoryName == ''){
            Alert.alert('Please Enter a Category Name')
            return
        } 
        if(planned == 0 || !planned){
            Alert.alert('Please Enter a Monthly Goal')
            return
        }   
        var newCategory = {
            'CategoryName' : categoryName,
            'Planned' : planned,
            'categoryType' : categoryType,
            'amountSpent' : 0
        }
        CustomFetch('AddCategory', {category: newCategory})
        .then(result => {
            if(result['message'] === 'Success'){
                newCategory['CategoryId'] = result['categoryId']
                dispatch(addCategory(newCategory))
                navigation.goBack()
            } else {
                console.log('Error Adding Category')
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
                    title="Add" 
                    textColor="white" 
                    style={styles.button}
                    backgroundColor={constants.colors.primaryColor} 
                    onPress={add}
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

export default AddCategoryScreen
