import React from 'react'
import { PinPad } from '../components/pinPad';
import { VerifyPin } from './verifyPin';
import { storeData, theme } from '../components/global';
import { dummies } from '../components/dummies';
import isObject from 'lodash/isObject';
import { Text } from 'react-native-elements';
import delay from 'lodash/delay';
import { closeAlert, showAlert } from 'react-native-customisable-alert';
import axios from 'axios';


export const CreatePin = ({navigation}) => {

    const formRef = React.useRef();
    const [pinScreen, setPinScreen] = React.useState(true);
    const [pin1, setPin1] = React.useState('');
    const [pinCode, setPinCode] = React.useState([]);
    const [titleText, setTitleText] = React.useState("Create new Transaction Pin");

    const verifyPinHandler = (code) => {
        const newPinAttempts = [...pinCode, code];
        if(newPinAttempts.length <= 4) {
            setPinCode(newPinAttempts);
        }

        if(isObject(code)) {
            setPinCode([]);
            return;
        }

        if(newPinAttempts.length === 4 && pin1 == ''){
            setPin1( newPinAttempts.join('') );
            setPinCode([]);
            setTitleText(<Text style={{color: theme.colors.primary}}>Enter New Transaction PIN (Again)</Text>);
            return;
        }

        if(newPinAttempts.length === 4 && pin1 != ''){
            const stringifiedPinCode = newPinAttempts.join('');
            
            if(pin1 === stringifiedPinCode) {
                setTitleText(<Text style={{color: theme.colors.primary}}>Your PIN code was matched</Text>);
                axios.put('update-pin', {pin: stringifiedPinCode}).then((res1) => {                    
                    if ( res1.data.status === 200 ) {
                        axios.get(`get-user`).then((res) => {
                            if ( res.data.status === 200) {                                       
                                storeData('basicData', {...res.data.data});
                                showAlert({alertType: 'success' , title: 'Success', message:  res1.data.message});                                
                                delay(() => {
                                    closeAlert();
                                    navigation.navigate('Home');
                                }, 2000);                                
                            }
                        });
                    } else {
                        showAlert({alertType: 'error' , title: 'Error', message: res1.data.errors});
                    }
                }).finally(() => {
                    setPinCode([])
                });
            } else {
                setTitleText(<Text style={{color: theme.colors.red}}>Your PIN code was not matched, enter the PINs again</Text>);
                setPinCode([]);
                setPin1('');
            }

        }
        
    }

    
    return (
        <>
            <PinPad 
                title={titleText}
                handler={verifyPinHandler}
                pinCode={pinCode}
            />
        </>
    );
};