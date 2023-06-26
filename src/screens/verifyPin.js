import React from 'react'
import { PinPad } from '../components/pinPad';
import delay from 'lodash/delay';
import { dummies } from '../components/dummies';
import isObject from 'lodash/isObject';
import { Context } from '../components/userContext';
import { getData, theme } from '../components/global';
import { Button, Overlay } from 'react-native-elements';

export const VerifyPin = ({action, title, closePinScreen, isVisible}) => {
    const {valueState, valueDispatch} = React.useContext(Context);
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
            valueDispatch({loader: {...dummies.modalProcess.loading}});
            getData('basicData').then(res => {
                if( res.pin == newPinAttempts.join('') ) {                    
                    valueDispatch({loader: {...dummies.modalProcess.success, text: 'PIN was matched, Please wait to continue with your transaction'}});
                    delay(() => {
                        valueDispatch({loader: {...dummies.modalProcess.hide}});
                        action && action();
                        closePinScreen && closePinScreen();
                    }, 1000);
                }else {
                    valueDispatch({loader: {...dummies.modalProcess.error, text: 'Incorrect PIN, please try again'}});
                }
            }).catch(error => {
                valueDispatch({loader: {...dummies.modalProcess.error, text: error}});
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