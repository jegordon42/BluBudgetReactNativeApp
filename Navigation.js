import 'react-native-gesture-handler';
import * as React from 'react';
import { useState } from 'react';
import { Alert} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Feather, Entypo, Foundation } from '@expo/vector-icons';
import Transactions from './Screens/Transaction/Transactions';
import AddTransactionScreen from './Screens/Transaction/AddTransactionScreen';
import EditTransaction from './Screens/Transaction/EditTransaction';
import FilterByCategory from './Screens/Filter/FilterByCategory'
import FilterByDate from './Screens/Filter/FilterByDate'
import FilterByAmount from './Screens/Filter/FilterByAmount';
import FilterByDescription from './Screens/Filter/FilterByDescription';
import Categories from './Screens/Category/Categories'
import EditCategory from './Screens/Category/EditCategory';
import AddCategoryScreen from './Screens/Category/AddCategoryScreen';
import DrawerContent from './Components/DrawerContent';
import Header from './Components/Header';
import Landing from './Screens/Auth/Landing';
import Login from './Screens/Auth/Login';
import ForgotPassword from './Screens/Auth/ForgotPassword';
import Settings from './Screens/Settings/Settings';
import About from './Screens/Settings/About';
import Privacy from './Screens/Settings/Privacy';
import TermsConditions from './Screens/Settings/TermsConditions'
import * as constants from './Constants'
import { setActiveTab, login, setAutologinFlag } from './Store/Actions';
import { getAuth } from '@firebase/auth';

const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function tabs(){
  const dispatch = useDispatch()
  return (
    <Tab.Navigator initialRouteName="Transactions" shifting={false} activeColor="white" labelStyle={{ fontSize: 12 }} barStyle={{ backgroundColor: constants.colors.primaryColor }}>
      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: ({ color }) => (<Feather name="list" color={color} size={26} />),
        }}
        listeners={{
          tabPress: e => {dispatch(setActiveTab('Transactions'))}
        }}
      />
      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color }) => (<Foundation name="graph-pie" color={color} size={26} />),
        }}
        listeners={{
          tabPress: e => {dispatch(setActiveTab('Categories'))}
        }}
      />
    </Tab.Navigator>
  )
}

function drawer(){
  return (
    <Drawer.Navigator 
      screenOptions={{header:(props) => <Header isTab={true} {...props}/>}}
      drawerContent={(props) => <DrawerContent {...props}/>}
    >
      <Drawer.Screen name="tabs" component={tabs} />
    </Drawer.Navigator>
  )
}

function SetUp(){
  Alert.alert("Set Up Your Categories", "We've started you out with a couple of examples. Customize your categories to create a budget that works for you!")
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="setUpExpenses">
          <Stack.Screen 
            name="setUpExpenses" 
            component={Categories} 
            options={{
              presentation:'card', 
              header:(props) => <Header {...props}/>
            }} 
          />
          <Stack.Screen 
            name="setUpIncome" 
            component={Categories} 
            options={{
              presentation:'card', 
              header:(props) => <Header {...props}/>
            }} 
          />
          <Stack.Screen 
            name="EditCategory" 
            component={EditCategory} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="Edit Category" {...props}/>
            }}
          />
          <Stack.Screen 
            name="AddCategoryScreen" 
            component={AddCategoryScreen} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="New Category" {...props}/>
            }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  )
  
}

function BudgetApp(){
  var isSetup = useSelector((state) => state.isSetup)
  if(isSetup)
    return <SetUp/>
  else if(isSetup === null)
  Alert.alert("Welcome to Blu Budget!", "Create transactions and keep track of your spending. Happy budgeting!")
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="drawer">
          <Stack.Screen 
            name="drawer" 
            component={drawer} 
            options={{headerShown:false}}
          />
          <Stack.Screen 
            name="EditTransaction" 
            component={EditTransaction} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="Edit Transaction" {...props}/>
            }}
          />
          <Stack.Screen 
            name="AddTransactionScreen" 
            component={AddTransactionScreen} 
            options={{ 
              header: (props) => <Header title="New Transaction" {...props} />,
              presentation:'modal'
            }} 
          />
          <Stack.Screen 
            name="EditCategory" 
            component={EditCategory} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="Edit Category" {...props}/>
            }}
          />
          <Stack.Screen 
            name="AddCategoryScreen" 
            component={AddCategoryScreen} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="New Category" {...props}/>
            }}
          />
          <Stack.Screen 
            name="Filter By Category" 
            component={FilterByCategory} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="Filter By Category" {...props}/>
            }}
          />
          <Stack.Screen 
            name="Filter By Date" 
            component={FilterByDate} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="Filter By Date" {...props}/>
            }}
          />
          <Stack.Screen 
            name="Filter By Amount" 
            component={FilterByAmount} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="Filter By Amount" {...props}/>
            }}
          />
          <Stack.Screen 
            name="Filter By Description" 
            component={FilterByDescription} 
            options={{
              presentation:'modal',
              header:(props) => <Header title="Filter By Description" {...props}/>
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={Settings} 
            options={{
              presentation:'card',
              header:(props) => <Header title="Settings" {...props}/>
            }}
          />
          <Stack.Screen 
            name="TermsConditions" 
            component={TermsConditions} 
            options={{
              presentation:'card',
              header:(props) => <Header title="Terms & Conditions" {...props}/>
            }}
          />
          <Stack.Screen 
            name="Privacy" 
            component={Privacy} 
            options={{
              presentation:'card',
              header:(props) => <Header title="Privacy Policy" {...props}/>
            }}
          />
          <Stack.Screen 
            name="About" 
            component={About} 
            options={{
              presentation:'card',
              header:(props) => <Header title="About" {...props}/>
            }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function Authentication(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="landing">
          <Stack.Screen 
            name="landing" 
            component={Landing} 
            options={{headerShown:false}}
          />
          <Stack.Screen 
            name="login" 
            component={Login} 
            options={{
              presentation:'card', 
              header:(props) => <Header {...props}/>
            }} 
          />
          <Stack.Screen 
            name="forgotPassword" 
            component={ForgotPassword} 
            options={{
              presentation:'card', 
              header:(props) => <Header {...props}/>
            }} 
          />
          <Stack.Screen 
            name="TermsConditions" 
            component={TermsConditions} 
            options={{
              presentation:'card',
              header:(props) => <Header title="Terms & Conditions" {...props}/>
            }}
          />
          <Stack.Screen 
            name="Privacy" 
            component={Privacy} 
            options={{
              presentation:'card',
              header:(props) => <Header title="Privacy Policy" {...props}/>
            }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function Navigation() {
  //AUTO LOGIN
  const [autologinFailed, setAutologinFailed] = useState(false)
  const dispatch = useDispatch()
  var unsubscribe = getAuth().onAuthStateChanged((user) => {
    if(autologinFailed)//This ensures autologin only happens on app start
      return
    setAutologinFailed(true)
    if(!user){ //If the user is logged in on this device
      dispatch(setAutologinFlag(true))
      return
    }
    //If this is app start and the user is logged in on firebase, login through flask
    var token = user['stsTokenManager']['accessToken']
    var userId = user['uid']
    fetch(constants.url + 'Login', {
      method: "POST",
      headers: { 
        "Content-type": "application/json",
        "authorization" : token
      },
      body: JSON.stringify({
          userId : userId
      })
    })
    .then(response => response.json())
    .then(result => {
      if(result['message'] == 'Success'){
        result['firebaseUser'] = user
        dispatch(login(result))
      }
    })
  })
  unsubscribe();
  
  var loggedIn = useSelector((state) => state.user)
  return (
      <>
        {loggedIn && 
          <BudgetApp/>
        }
        {!loggedIn && 
          <Authentication/>
        }     
      </>
          
  );
}
