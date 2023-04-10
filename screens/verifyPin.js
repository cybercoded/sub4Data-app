import React from 'react'
import { PinPad } from '../components/pinPad';
import indexOf from 'lodash/indexOf';
import delay from 'lodash/delay';
import { dummies } from '../components/dummies';
import isObject from 'lodash/isObject';
import { Context } from '../components/userContext';
import { API, getData } from '../components/global';

export const VerifyPin = ({route, navigation}) => {

    const {landingPage} = route.params;
    const {valueState, valueDispatch} = React.useContext(Context);

    const [pinCode, setPinCode] = React.useState([]);

    const verifyPinHandler = (code) => {
        const newPinAttempts = [...pinCode, code];
        setPinCode(newPinAttempts)
        
        if(isObject(code)) {
            setPinCode([]);
            return;
        }

        if(newPinAttempts.length >= 4 ){
            valueDispatch({loader: {...dummies.modalProcess.loading}});
            // API.put('check-pin.php?userId='+valueState.basicData.userId, {pin: newPinAttempts.join('')}).then(res => {
            getData('basicData').then(res => {
                if( res.pinCode == newPinAttempts.join('') ) {                    
                    valueDispatch({loader: {...dummies.modalProcess.success, text: 'PIN was matched, Please wait to continue with your transaction'}});
                    setPinCode([]);
                    delay(() => {
                        valueDispatch({loader: {...dummies.modalProcess.hide}});
                        navigation.navigate({
                            name: landingPage,
                            params: { isPinVerified: true },
                            merge: true,
                          });
                    }, 1000);
                }else {
                    valueDispatch({loader: {...dummies.modalProcess.error, text: 'Incorrect PIN, please try again'}});
                }
            }).catch(error => {
                valueDispatch({loader: {...dummies.modalProcess.error, text: error}});
            });
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