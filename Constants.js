import { StyleSheet, StatusBar } from 'react-native'

export const url = "https://budgetflaskapp.azurewebsites.net/"
//export const url = "http://192.168.1.220:8000/"
export const defaultState = {
  firebaseUser: null,
  user: null,
  isSetup:false,
  activeTab:'',
  activeModal: '',
  expenseCategories: [],
  incomeCategories: [],
  categoryDictionary: {},
  expenseTransactions: [],
  incomeTransactions: [],
  filters: {
    type:'Expenses',
    startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1),
    endDate: new Date(),
    incomeCategories: [],
    expenseCategories:[]
  },
  filteredExpenseTransactions: [],
  filteredIncomeTransactions: [],
  forceRerenderKey : 0,
  autologinFlag : true
};

export const colors = {
    primaryColor: '#1DA1F2',
    primaryColorButLighter: '#b7e1fb',
    accentColor: '#ff6f00',
    backgroundColor: '#ebebeb'
  };

export const formatMoney = (val) => {
    return '$' + val.toFixed(2)
}

export const formatDate = (date) => {
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
}

export const defaultFilters = {
  type:'Expenses',
  startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1),
  endDate: new Date(),
  incomeCategories: [],
  expenseCategories:[]
}

export const setFilteredTransactions = (transType, state) => {
  var transactions = transType === "Expenses" ? state.expenseTransactions : state.incomeTransactions
  var trans = []
  var filterCategories = transType === "Expenses" ? state.filters.expenseCategories : state.filters.incomeCategories
  var filterAmount = state.filters.amount
  var filterDesc = state.filters.description
  state = initCategories(transType, state)

  for(var i = 0; i < transactions.length; i++){
    var transaction = transactions[i];
    var transDate = new Date(transaction['Date'])
    
    if(state.filters.startDate <= transDate && state.filters.endDate >= transDate){
      if(filterAmount){
        var comparator = filterAmount.comparator.value
        if(comparator === 'Equals' && filterAmount.value !== transaction['Amount'])
          continue
        if(comparator === 'Not Equal To' && filterAmount.value === transaction['Amount'])
          continue
        if(comparator === 'Less Than' && filterAmount.value <= transaction['Amount'])
          continue
        if(comparator === 'Less Than Or Equal To' && filterAmount.value < transaction['Amount'])
          continue
        if(comparator === 'Greater Than' && filterAmount.value >= transaction['Amount'])
          continue
        if(comparator === 'Greater Than Or Equal To' && filterAmount.value > transaction['Amount'])
          continue
        if(comparator === 'In Range' && (filterAmount.value.valueFrom > transaction['Amount'] || filterAmount.value.valueTo < transaction['Amount']))
          continue
      }
      if(filterDesc){
        var comparator = filterDesc.comparator.value
        if(comparator === 'Equals' && filterDesc.value.toLowerCase() != transaction['Description'].toLowerCase())
          continue
        if(comparator === 'Not Equal To' && filterDesc.value.toLowerCase() == transaction['Description'].toLowerCase())
          continue
        if(comparator === 'Contains' && !transaction['Description'].toLowerCase().includes(filterDesc.value.toLowerCase()))
          continue
        if(comparator === 'Does Not Contain' && transaction['Description'].toLowerCase().includes(filterDesc.value.toLowerCase()))
          continue
        if(comparator === 'Starts With' && !transaction['Description'].toLowerCase().startsWith(filterDesc.value.toLowerCase()))
          continue
        if(comparator === 'Ends With' && !transaction['Description'].toLowerCase().endsWith(filterDesc.value.toLowerCase()))
          continue
      }
      state.categoryDictionary[transaction['CategoryId']]['amountSpent'] += transaction['Amount']
      if(!filterCategories.includes(transaction['CategoryId']))
        continue
      trans.push(transaction)
    }
  }

  trans.sort((a, b) => (new Date(a['Date']) < new Date(b['Date'])) ? 1 : -1)

  if(transType === "Expenses")
    state.filteredExpenseTransactions = trans
  else
    state.filteredIncomeTransactions = trans
  return state
}

function initCategories(transType, state){
  var categories = transType === "Expenses" ? state.expenseCategories : state.incomeCategories
  for(var i = 0; i < categories.length; i++)
    state.categoryDictionary[categories[i]['CategoryId']]['amountSpent'] = 0
  return state
}

function getCategory(category, transactions){
  var categoryList = []
  for(var i = 0; i < categories.length; i++){
    var categoryWithAmount = categories[i]
    categoryWithAmount['amountSpent'] = 0
    for(var x = 0; x < transactions.length; x++){
      if(transactions[x]['CategoryId'] == categories[i]['CategoryId'])
        categoryWithAmount['amountSpent'] += transactions[x]['Amount']
    }
    categoryWithAmount['amountSpent'] = categoryWithAmount['amountSpent'].toFixed(0)
    categoryList.push(categoryWithAmount)
  }
  return categoryList
}