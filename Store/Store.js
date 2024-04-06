import * as constants from '../Constants'
import { createStore } from 'redux';

const defaultState = {
  firebaseUser: null,
  user: null,
  isSetup:false,
  activeTab:'',
  activeModal: '',
  selectedCategoryId: null,
  selectedTransaction: null,
  expenseCategories: [],
  incomeCategories: [],
  categoryDictionary: {},
  expenseTransactions: [],
  incomeTransactions: [],
  filters: Object.assign({}, constants.defaultFilters),
  filteredExpenseTransactions: [],
  filteredIncomeTransactions: [],
  forceRerenderKey : 0,
  autologinFlag : false
};

const Reducer = (state = defaultState, action) => {
  switch (action.type) {
    case "LOGIN":
        state.firebaseUser = action.data.result.firebaseUser 
        if(action.data.isSignUp){
          state.activeModal = 'Set Up Expense Categories'
          state.isSetup = true
        }
        else{
          state.activeTab = 'Transactions'
          state.activeModal = ''
        }
        var userObj = action.data.result.userObj
        state.user = userObj['user'];
        state.expenseCategories = userObj['expenseCategories'];
        state.incomeCategories = userObj['incomeCategories'];
        state.categoryDictionary = getCategoryDictionary(userObj['incomeCategories'], userObj['expenseCategories'])
        initCategoryFilters(state)

        state.expenseTransactions = userObj['expenseTransactions']
        state = constants.setFilteredTransactions("Expenses", state)

        state.incomeTransactions = userObj['incomeTransactions']
        state = constants.setFilteredTransactions("Income", state)

        return state
    case "LOGOUT":
          state = Object.assign({}, constants.defaultState)
          state.autologinFlag = true
          return state
    case "SELECT_TRANSACTION":
      state.selectedTransaction = action.data.transaction;
      state.activeModal = 'Edit Transaction'
      return state
    case "SAVE_TRANSACTION":
      var transactions = state.filters.type == 'Expenses' ? state.expenseTransactions : state.incomeTransactions
      for(var i = 0; i < transactions.length; i++){
        if(transactions[i]['TransactionId'] == action.data.transaction.TransactionId){
          transactions[i] = action.data.transaction
        }
      }
      state = constants.setFilteredTransactions(state.filters.type, state)
      state.activeModal = ''
      state.forceRerenderKey += 1;
      return state
    case "DELETE_TRANSACTION":
      var transactions = state.filters.type == 'Expenses' ? state.expenseTransactions : state.incomeTransactions
      for(var i = 0; i < transactions.length; i++){
        if(transactions[i]['TransactionId'] == action.data.TransactionId){
          transactions.splice(i, 1);
          break
        }
      }
      state = constants.setFilteredTransactions(state.filters.type, state)
      state.forceRerenderKey += 1;
      return state
    case 'ADD_TRANSACTION':
      var transType = action.data.transaction.transactionType
      delete action.data.transaction['transactionType']
      delete action.data.transaction['userId']
      if(transType === "Expense"){
        state.expenseTransactions.unshift(action.data.transaction)
        constants.setFilteredTransactions("Expenses", state)
      } else {
        state.incomeTransactions.unshift(action.data.transaction)
        constants.setFilteredTransactions("Income", state)
      }
      state.forceRerenderKey += 1;
      return state
    case "SELECT_CATEGORY":
      state.selectedCategoryId = action.data.categoryId;
      state.activeModal = 'Edit Category'
      return state
    case "SAVE_CATEGORY":
      var categories = state.filters.type == 'Expenses' ? state.expenseCategories : state.incomeCategories
      for(var i = 0; i < categories.length; i++){
        if(categories[i]['CategoryId'] == action.data.category.CategoryId){
          categories[i] = action.data.category
        }
      }
      state.categoryDictionary[action.data.category.CategoryId] = action.data.category
      if(state.isSetup)
        state.activeModal = 'Set Up ' + state.filters.type.replace('es', 'e') + ' Categories'
      else
        state.activeModal = ''
      state.forceRerenderKey += 1;
      return state
    case "DELETE_CATEGORY":
      var categories = state.filters.type == 'Expenses' ? state.expenseCategories : state.incomeCategories
      for(var i = 0; i < categories.length; i++){
        if(categories[i]['CategoryId'] == action.data.categoryId)
          categories.splice(i, 1);
      }
      delete state.categoryDictionary[action.data.categoryId]
      var filters = state.filters.type == 'Expenses' ? state.filters.expenseCategories : state.filters.incomeCategories
      for(var i = 0; i < filters.length; i++){
        if(filters[i] == action.data.categoryId)
          filters.splice(i, 1);
      }
      state.forceRerenderKey += 1;
      return state
    case "ADD_CATEGORY":
      var categories = state.filters.type == 'Expenses' ? state.expenseCategories : state.incomeCategories
      categories.push(action.data.category)
      state.categoryDictionary[action.data.category.CategoryId] = action.data.category
      var filters = state.filters.type == 'Expenses' ? state.filters.expenseCategories : state.filters.incomeCategories
      filters.push(action.data.category.CategoryId)
      if(state.isSetup)
        state.activeModal = 'Set Up ' + state.filters.type.replace('es', 'e') + ' Categories'
      else
        state.activeModal = ''
      state.forceRerenderKey += 1;
      return state
    case "SET_ACTIVE_TAB":
      state.activeTab = action.data.tab;
      return state
    case "SET_ACTIVE_MODAL":
      state.activeModal = action.data.modal;
      return state
    case "FORCE_RERENDER":
      state.forceRerenderKey += 1;
      return state
    case "SET_FILTER":
        if(action.data.filter === "reset"){
          state.filters = Object.assign({}, constants.defaultFilters)
          initCategoryFilters(state)
        }
        else if(action.data.filter === "startDate")
          state.filters.startDate = action.data.value
        else if(action.data.filter === "endDate")
          state.filters.endDate = action.data.value
        else if(action.data.filter === "date"){
          state.filters.startDate = action.data.value.startDate
          state.filters.endDate = action.data.value.endDate
        }
        else if(action.data.filter === "type")
          state.filters.type = action.data.value
        else if(action.data.filter === "incomeCategories" || action.data.filter === "expenseCategories"){
          var categories = action.data.filter === "incomeCategories" ? state.filters.incomeCategories : state.filters.expenseCategories
          if(categories.includes(action.data.value))
            categories.splice(categories.indexOf(action.data.value), 1);
          else
            categories.push(action.data.value)
        }
        constants.setFilteredTransactions(state.filters.type, state)
        state.forceRerenderKey += 1;
        return state
    case "SET_FORM":
        if(action.data.form)
          state['form'] = Object.assign({}, action.data.form)
        else
          delete state.form
        return state
    case "SAVE_FORM":
        if(state.activeModal === 'Filter By Amount'){
          if(state.form)
            state.filters['amount'] = Object.assign({}, state.form) 
          else
            delete state.filters.amount
        } 
        else if(state.activeModal === 'Filter By Description'){
          if(state.form)
            state.filters['description'] = Object.assign({}, state.form) 
          else
            delete state.filters.description
        } 
        constants.setFilteredTransactions(state.filters.type, state)
        state.forceRerenderKey += 1;
        return state
    case 'SET_AUTOLOGIN_FLAG':
        state.autologinFlag = action.data.value
        return state
    case 'FINISH_SETUP':
        state.activeTab = 'Transactions'
        state.activeModal = ''
        state.isSetup = null
        return state
    default:
      return state
  }
};

function getCategoryDictionary(incomeCategories, expenseCategories, fi){
  var categoryDictionary = {}
  incomeCategories.forEach((category) => categoryDictionary[category.CategoryId] = category)
  expenseCategories.forEach((category) => categoryDictionary[category.CategoryId] = category)
  return categoryDictionary;
}

function initCategoryFilters(state){
  state.filters.incomeCategories = []
  state.filters.expenseCategories = []
  state.incomeCategories.forEach((category) => state.filters.incomeCategories.push(category.CategoryId))
  state.expenseCategories.forEach((category) => state.filters.expenseCategories.push(category.CategoryId))
}

let Store = createStore(Reducer)

export default Store;