import 'react-native-gesture-handler';
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider } from 'react-native-elements'
import { ToastProvider } from 'react-native-toast-notifications';
import { theme } from './src/components/global';
import { Context, initialValues, reducer } from './src/components/userContext';
import { Navigations } from './src/components/navigations';
import { Text } from 'react-native';


const App = () => {
    const [values, dispatch] = React.useReducer(reducer, initialValues);
    
    return (
        <ToastProvider>
            <StatusBar style="auto" />
            <ThemeProvider theme={theme}>
                <Context.Provider value={{ valueState: values, valueDispatch: dispatch }}>
                    <Navigations />
                </Context.Provider>
            </ThemeProvider>
        </ToastProvider>
    )
};

export default App;
