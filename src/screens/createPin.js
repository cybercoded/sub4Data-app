import React from 'react'
import { PinPad } from '../components/pinPad';
import { VerifyPin } from './verifyPin';
import { API, storeData, theme } from '../components/global';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import isObject from 'lodash/isObject';
import { Text } from 'react-native-elements';
import delay from 'lodash/delay';


export const CreatePin = ({navigation}) => {

    const formRef = React.useRef();
    const [pinScreen, setPinScreen] = React.useState(true);
    const { valueState, valueDispatch } = React.useContext(Context);
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

                valueDispatch({loader: {...dummies.modalProcess.loading}});
                API.put('update-pin', {pin: stringifiedPinCode}).then((res1) => {                    
                    if ( res1.data.status === 200 ) {
                        API.get(`get-user`).then((res) => {
                            if ( res.data.status === 200) {                                       
                                storeData('basicData', {...res.data.data});
                                valueDispatch({loader: {...dummies.modalProcess.success, text: res1.data.message}});                                
                                delay(() => {
                                    valueDispatch({loader: {...dummies.modalProcess.hide}});
                                    navigation.navigate('Home');
                                }, 2000);                                
                            }
                        })
                    } else {
                        valueDispatch({loader: {...dummies.modalProcess.error, text: res1.data.errors}});
                    }
                }).catch(error => {
                    valueDispatch({loader: {...dummies.modalProcess.error, text: error}});
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