import 'react-native-gesture-handler';
import * as React from 'react';
import { Provider } from 'react-redux';
import Store from './Store/Store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeApp } from "firebase/app";
import Navigation from './Navigation'

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
const app = initializeApp(firebaseConfig);

function App() {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
          <Navigation/>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;