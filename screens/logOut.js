import { View, Text, } from 'react-native'
import React, { useEffect } from 'react'
import { Loader, clearData, getData, storeData, styles } from '../components/global'
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import delay from 'lodash/delay';

export const Logout = ({navigation}) => {

    const {valueState, valueDispatch} = React.useContext(Context);

    useEffect(() => {
        
        valueDispatch({loader: {...dummies.modalProcess.loading}});

        getData('basicData').then(res => {
            
            valueDispatch({loader: {...dummies.modalProcess.success, text: 'Successfully logged out'}});
            
            delay(() => {
                storeData('basicData', {...res, isLoggedIn: false})
                valueDispatch({loader: {...dummies.modalProcess.hide}})
                navigation.navigate('Signin');
                clearData();
            }, 1000);
        });
    }, [])
    

    return (
        <View style={styles.container}>
            <Loader
                props={valueState.loader}
                handler={() => valueDispatch({
                    loader: {...dummies.modalProcess.hide}
                }) }
            />
            <Text>Login out user.......</Text>
        </View>
    );
};