import React from 'react'
import { PinPad } from '../components/pinPad';
import indexOf from 'lodash/indexOf';
import delay from 'lodash/delay';
import { dummies } from '../components/dummies';
import isObject from 'lodash/isObject';
import { Context } from '../components/userContext';
import { API, getData } from '../components/global';
import { isNull } from 'lodash';

export const VerifyPin = ({route, navigation}) => {
    const {valueState, valueDispatch} = React.useContext(Context);
    const [pinCode, setPinCode] = React.useState([]);

    const {landingPage = null} = route.params ?? {};


    const verifyPinHandler = (code) => {
        const newPinAttempts = [...pinCode, code];

        if(newPinAttempts.length <= 4 ){
            setPinCode(newPinAttempts)
        }
        if(isObject(code)) {
            setPinCode([]);
            return;
        }

        if(newPinAttempts.length >= 4 ){
            valueDispatch({loader: {...dummies.modalProcess.loading}});
            // API.put('check-pin.php?userId='+valueState.basicData.userId, {pin: newPinAttempts.join('')}).then(res => {
            getData('basicData').then(res => {
                if( res.pinCode == newPinAttempts.join('') && res.userId === valueState.basicData.userId ) {                    
                    valueDispatch({loader: {...dummies.modalProcess.success, text: 'PIN was matched, Please wait to continue with your transaction'}});
                    delay(() => {
                        valueDispatch({loader: {...dummies.modalProcess.hide}});
                        
                        if( !isNull(landingPage) ) {
                            navigation.navigate(landingPage);
                        }else {
                            console.warn('back was clicked')
                            navigation.goBack();
                        }
                    }, 1000);
                }else {
                    valueDispatch({loader: {...dummies.modalProcess.error, text: 'Incorrect PIN, please try again'}});
                }
            }).catch(error => {
                valueDispatch({loader: {...dummies.modalProcess.error, text: error}});
            }).finally(() => {
                setPinCode([])
            })
        }
    }    
    
    return (

        <PinPad 
            navigation={navigation}
            title='Enter your Transaction PIN'
            handler={verifyPinHandler}
            pinCode={pinCode}
        />
    );
};