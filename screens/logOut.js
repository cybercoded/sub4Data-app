import { View, Text, } from 'react-native'
import React, { useEffect } from 'react'
import { clearData, storeData } from '../components/global'

export const Logout = ({navigation}) => {

    useEffect(() => {
        
        storeData('isLoggedIn', false).then(res => {
            navigation.navigate('Signin');
        })        

    }, [])
    

    return (
        <View>
            <Text>Login out user.......</Text>
        </View>
    );
};