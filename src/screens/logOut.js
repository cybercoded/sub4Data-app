import { View, Text, } from 'react-native'
import React, { useEffect } from 'react'
import { Loader, clearData, getData, storeData, styles } from '../components/global'
import { dummies } from '../components/dummies';

import delay from 'lodash/delay';
import { closeAlert, showAlert } from 'react-native-customisable-alert';

export const Logout = ({navigation}) => {

    const {valueState, valueDispatch} = React.useContext(Context);

    useEffect(() => {

        getData('basicData').then(res => {            
            showAlert({alertType: 'success' , title: 'Success', message:  'Successfully logged out'});
            
            delay(() => {
                closeAlert();
                storeData('basicData', {...res, isLoggedIn: false})
                navigation.navigate('Signin');
                clearData();
            }, 1000);
        });
    }, []);
    

    return (
        <>
        </>
    );
};