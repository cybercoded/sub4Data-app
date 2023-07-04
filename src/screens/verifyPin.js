import React from 'react'
import { PinPad } from '../components/pinPad';
import delay from 'lodash/delay';
import { dummies } from '../components/dummies';
import isObject from 'lodash/isObject';

import { getData, theme } from '../components/global';
import { Button, Overlay } from 'react-native-elements';
import { closeAlert, showAlert } from 'react-native-customisable-alert';

export const VerifyPin = ({action, title, closePinScreen, isVisible}) => {
    const [pinCode, setPinCode] = React.useState([]);

    const verifyPinHandler = (code) => {
        const newPinAttempts = [...pinCode, code];
        if(newPinAttempts.length <= 4) {
            setPinCode(newPinAttempts);
        }

        if(isObject(code)) {
            setPinCode([]);
            return;
        }

        if(newPinAttempts.length === 4 ){
            getData('basicData').then(res => {
                if( res.pin == newPinAttempts.join('') ) {                    
                    showAlert({alertType: 'success' , title: 'Success', message:  'PIN was matched, Please wait to continue with your transaction'});
                    delay(() => {
                        closeAlert();
                        action && action();
                        closePinScreen && closePinScreen();
                    }, 1000);
                }else {
                    showAlert({alertType: 'error' , title: 'Error', message: 'Incorrect PIN, please try again'});
                }
            }).finally(() => {
                setPinCode([])
            });
        }
    }    
    
    return (

        <Overlay isVisible={isVisible} onBackdropPress={false} fullScreen={true}>

            <PinPad 
                title={title ? title : 'Enter Your Transaction PIN'}
                handler={verifyPinHandler}
                pinCode={pinCode}
            />
           <Button type="clear" titleStyle={{color: theme.colors.dim}}  onPress={closePinScreen} title="Go back" />
           <Button 
                type="clear" 
                onPress={() => navigation.navigate('VerifyOtpPIn') } 
                title="I forgot my Transaction PIN" 
            />
        </Overlay>
    );
};