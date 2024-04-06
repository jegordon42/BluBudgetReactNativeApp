const login = (result, isSignUp) => (
  {
    type: 'LOGIN',
    data: {result, isSignUp}
  }
);

const logout = () => (
  {
    type: 'LOGOUT'
  }
);

const selectTransaction = (transaction) => (
  {
    type: 'SELECT_TRANSACTION',
    data: {transaction}
  }
);

const saveTransaction = (transaction) => (
  {
    type: 'SAVE_TRANSACTION',
    data: {transaction}
  }
);

const addTransaction = (transaction) => {
  return {
    type: 'ADD_TRANSACTION',
    data: { transaction }
  }
}

const deleteTransaction = (TransactionId) => (
  {
    type: 'DELETE_TRANSACTION',
    data: {TransactionId}
  }
);

const selectCategory = (categoryId) => (
  {
    type: 'SELECT_CATEGORY',
    data: {categoryId}
  }
);

const saveCategory = (category) => (
  {
    type: 'SAVE_CATEGORY',
    data: {category}
  }
);

const addCategory = (category) => (
  {
    type: 'ADD_CATEGORY',
    data: {category}
  }
);

const deleteCategory = (categoryId) => (
  {
    type: 'DELETE_CATEGORY',
    data: {categoryId}
  }
);

const setActiveTab = (tab) => (
  {
    type: 'SET_ACTIVE_TAB',
    data: {tab}
  }
);

const setActiveModal = (modal) => (
  {
    type: 'SET_ACTIVE_MODAL',
    data: {modal}
  }
);

const setFilter = (filter, value) => (
  {
    type: 'SET_FILTER',
    data: {filter, value}
  }
);

const setForm = (form) => (
  {
    type: 'SET_FORM',
    data: {form}
  }
);

const saveForm = () => (
  {
    type: 'SAVE_FORM'
  }
);

const forceRerender = () => (
  {
    type: 'FORCE_RERENDER'
  }
);

const setAutologinFlag = (value) => {
  return {
    type: 'SET_AUTOLOGIN_FLAG',
    data: { value }
  }
}

const finishSetup = () => {
  return {
    type: 'FINISH_SETUP'
  }
}

export {login, logout, selectTransaction, saveTransaction, addTransaction, deleteTransaction, selectCategory, saveCategory, addCategory, deleteCategory, setActiveTab, setActiveModal, setFilter, forceRerender, setForm, saveForm, setAutologinFlag, finishSetup}
