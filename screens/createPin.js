import React from 'react'
import { PinPad } from '../components/pinPad';


export const CreatePin = ({navigation}) => {

    const [pin1, setPin1] = React.useState('');
    const [pinResponseText, setPinResponseText] = React.useState(<Text>To keep your information secured</Text>);
    const BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, <Icon size={30} color={theme.colors.primary} name='backspace' />];
    const [selectedPIN, setSelectedPIN] = React.useState();
    const [pinCode, setPinCode] = React.useState([]);
    const [titleText, setTitleText] = React.useState(props.title)

    const pinHandler = (code) => {
        const newPinAttempts = [...pinCode, code];
        setPinCode(newPinAttempts);

        if(indexOf(BUTTONS, code) === 10) {
            setPinCode([]);
            setPin1('');
            return;
        }

        if(newPinAttempts.length == 4 && pin1 == ''){
            setPin1( newPinAttempts.join('') );
            setPinCode([]);
            setPinResponseText(<Text>To keep your information secured</Text>);
            return;
        }

        if(newPinAttempts.length == 4 && pin1 != ''){
            const stringifiedPinCode = newPinAttempts.join('');
            
            if(pin1 === stringifiedPinCode) {
                valueDispatch({loader: {...dummies.modalProcess.loading}});
                API.post('update-pin.php?userId='+valueState.basicData.userId, {pin: stringifiedPinCode})
                .then((res) => {                    
                    if ( res.data.status === true ) {
                        valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message}});
                        storeData('basicData', {...valueState.basicData, pinCode: stringifiedPinCode});
                        delay(() => {
                            valueDispatch({loader: {...valueState.loader, visible: false}});
                            navigation.navigate('Dashboard');
                        }, 2000);
                    }
                })
                .catch(error => {
                    console.log(error);
                });

                setPinResponseText(<Text style={{color: theme.colors.primary}}>Your PIN code was matched</Text>);
            } else {
                setPinResponseText(<Text style={{color: theme.colors.red}}>Your PIN code was not matched, enter the PINs again</Text>);
                setPinCode([]);
                setPin1('');
            }

        }
        
    }

    
    return (

        <PinPad navigation={navigation} />
    );
};