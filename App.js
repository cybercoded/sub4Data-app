import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "react-native-elements";
import { ToastProvider } from "react-native-toast-notifications";
import { BASE_URL, theme } from "./src/components/global";
import { RootNavigators } from "./src/components/rootNavigators";
import axios from "axios";
import Toast from 'react-native-toast-notifications';
import Spinner from "react-native-loading-spinner-overlay";
import CustomisableAlert from "react-native-customisable-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { delay } from "lodash";
// import * as SplashScreen from 'expo-splash-screen';

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

// SplashScreen.preventAutoHideAsync();

const App = () => {
    const [isReady, setIsReady] = React.useState(false);

    axios.interceptors.request.use(
        function (request) {
            setIsReady(true);
            return request;
        },

        error =>  Promise.reject(error)
    );

    axios.interceptors.response.use(
        function (response) {
            setIsReady(false);
            return response;
        },
        function (error) {   
            setIsReady(false);
            toast.hideAll();
            toast.show(error.message, {type: 'danger'});    
            return Promise.reject(error);
        }
    );

    const onLayoutRootView = React.useCallback(async () => {
        if (isReady) {
          await SplashScreen.hideAsync();
        }
    }, [isReady]);
    
    if (!isReady) {
        // return null;
    }

    return (
        <ToastProvider onLayout={onLayoutRootView}>
            {/* <StatusBar style="auto" /> */}
            <ThemeProvider theme={theme}>
                <RootNavigators />
            </ThemeProvider>

            <Spinner visible={isReady} />
            <CustomisableAlert
                btnStyle={{backgroundColor: theme.colors.primary}}
                btnRightStyle={{backgroundColor: 'transparent', borderColor: theme.colors.primary, borderWidth: 1}}
                btnRightLabelStyle={{color: theme.colors.primary}}
                btnLeftLabelStyle={{color: theme.colors.white}}
            />
            <Toast ref={(ref) => global['toast'] = ref}/>
        </ToastProvider>
    );
};

export default App;
