import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "react-native-elements";
import { ToastProvider } from "react-native-toast-notifications";
import { BASE_URL, theme } from "./src/components/global";
import { Context, initialValues, reducer } from "./src/components/userContext";
import { Navigations } from "./src/components/navigations";
import axios from "axios";
import Toast from 'react-native-toast-notifications';
import Spinner from "react-native-loading-spinner-overlay";
import CustomisableAlert from "react-native-customisable-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";

axios.interceptors.request.use(
    async (config) => {
        // config.baseURL = BASE_URL+"laravel/api/v1/";
        config.baseURL = BASE_URL+"api/v1/";
        config.headers.post['Content-Type'] = 'application/json';
        config.headers.post['Accept'] = 'application/json';
        config.withCredentials = true;
        const token = JSON.parse(await AsyncStorage.getItem('auth_token'));
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        
        return config;
    },

    error =>  Promise.reject(error)
);

const App = () => {
    const [values, dispatch] = React.useReducer(reducer, initialValues);
    const [isLoading, setIsLoading] = React.useState(false);

    axios.interceptors.request.use(
        function (request) {
            setIsLoading(true);
            return request;
        },

        error =>  Promise.reject(error)
    );

    axios.interceptors.response.use(
        function (response) {
            setIsLoading(false);
            return response;
        },
        function (error) {   
            setIsLoading(false);
            toast.hideAll();
            toast.show(error.message, {type: 'danger'});    
            return Promise.reject(error);
        }
    );

    return (
        <ToastProvider>
            <StatusBar style="auto" />
            <ThemeProvider theme={theme}>
                <Context.Provider value={{ valueState: values, valueDispatch: dispatch }}>
                    <Navigations />
                </Context.Provider>
            </ThemeProvider>

            <Spinner visible={isLoading} />
            <CustomisableAlert />
            <Toast ref={(ref) => global['toast'] = ref}/>

        </ToastProvider>
    );
};

export default App;
