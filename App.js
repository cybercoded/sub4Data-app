import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'
import { getData, storeData, theme } from './components/global'
import { Context, initialValues, reducer } from './components/userContext'
import { ThemeProvider } from 'react-native-elements'
import { Navigations } from './navigations'

export default function App() {
    const [values, dispatch] = React.useReducer(reducer, initialValues)
    const autoRender = () => {
        storeData('loader', initialValues.loader)
        getData('basicData').then((data) => {
            dispatch({ basicData: data })
        })
    }
    React.useEffect(() => {
        autoRender()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="auto" />
            <ThemeProvider theme={theme}>
                <Context.Provider value={{ valueState: values, valueDispatch: dispatch }}>
                    <Navigations />
                </Context.Provider>
            </ThemeProvider>
        </View>
    )
}
