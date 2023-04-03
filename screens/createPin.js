import React from 'react'
import { View } from 'react-native';
import { API, Loader, getData, styles, theme } from '../components/global';
import { Icon, Text } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import isNumber from 'lodash/isNumber';
import { indexOf, isString } from 'lodash';
import { Context } from '../components/userContext';


export const CreatePin = ({route, navigation}) => {
    const { type, userId } = route.params;

    const BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, <Icon size={30} color={theme.colors.primary} name='backspace' />];
    const [selectedPIN, setSelectedPIN] = React.useState();
    const [pinCode, setPinCode] = React.useState([]);
    const [pin1, setPin1] = React.useState('');
    const [pinResponseText, setPinResponseText] = React.useState(<Text>To keep your information secured</Text>);
    
    const {valueState, valueDispatch} = React.useContext(Context);

    const createPinHandler = (code) => {
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
                valueDispatch({loader: {...valueState.loader, visible: true}});
                API.post('update-pin.php?userId='+userId, {pin: stringifiedPinCode})
                .then(response => {
                    if(response.status) {
                        getData('pinCode', response.data.pinCode);
                    }
                    valueDispatch({loader: {...valueState.loader, visible: false}});
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

    const updatePinHandler = (code) => {
        
        if(indexOf(BUTTONS, code) === 10) {
            setPinCode([]);
            return;
        }

        if(pinCode.length >= 4 ){
            API.put('update.php', {code: pinCode.join('')}).then(response => {

            });
            return;
        }
        
        const newPinAttempts = [...pinCode, code];
        setPinCode(newPinAttempts)
    }

    const checkPinHandler = (code) => {
        
        if(indexOf(BUTTONS, code) === 10) {
            setPinCode([]);
            return;
        }

        if(pinCode.length >= 4 ){
            API.put('update.php?userId='+userId, {code: pinCode.join('')}).then(response => {
                console.warn(response);
            });
            return;
        }
        
        const newPinAttempts = [...pinCode, code];
        setPinCode(newPinAttempts)
    }
    
    return (

        <View style={styles.container}>
            <Loader
                props={valueState.loader}
                handler={() => valueDispatch({loader: {...valueState.loader, visible: false}})}
            />
            <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: 'bold'}}>
                       
                        {
                            pin1 == '' ? '1. Enter a PIN Code' : '2. Enter your PIN Code again'
                        }
                    </Text>
                </View>
                <View>
                    {pinResponseText}
                </View>
            </View>
            
            <View style={{flex: 1}}>
                <View style={[styles.rowFlex, { width: 80 }]}>
                    {[...Array(4)].map((code, codeIndex) => (
                    <TouchableOpacity
                        key={codeIndex}
                    >   
                        {
                            pinCode[codeIndex] ? (
                                <View style={styles.currentDot}></View>
                            ) : <View style={styles.dots}></View>
                        }
                    </TouchableOpacity>
                    ))}
                </View>
            </View>
            
            <View style={{flex: 3}}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                {
                BUTTONS.map((code, codeIndex) => (
                    <View style={{ flexBasis: '30%' }} key={codeIndex}>
                        <TouchableOpacity                    
                            onPress={() => {
                                createPinHandler(code)
                                setSelectedPIN(code)
                            }}
                            style={{
                                backgroundColor: theme.colors[selectedPIN === code ? 'primary' : 'dimmer'],
                                height: 80,
                                width: 80,
                                borderRadius: 50,
                                justifyContent: 'center',
                                margin: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors[selectedPIN === code ? 'white' : 'dim'],
                                    textAlign: 'center',
                                    fontSize: 25,
                                    alignSelf: 'center',
                                }}
                            >
                                {code}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))
                }
                </View>
            </View>
        </View>
    );
};