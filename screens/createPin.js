import React from 'react'
import { View } from 'react-native';
import { styles, theme } from '../components/global';
import { Icon, Text } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import isNumber from 'lodash/isNumber';
import { indexOf, isString } from 'lodash';


export const CreatePin = ({navigation}) => {
    const BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, <Icon size={30} color={theme.colors.primary} name='backspace' />, <Icon size={30} color={theme.colors.primary} name='check-circle' />];
    const [selectedPIN, setSelectedPIN] = React.useState();
    const [pinCode, setPinCode] = React.useState([]);

    const enterPin = (code) => {
        
        
        if(pinCode.length >= 4){
            console.log('success', pinCode.length)
            return;
        }
        if(indexOf(BUTTONS, code) === 10) {
            setPinCode([]);
        }
        const newPinAttempts = [...pinCode, code];
        setPinCode(newPinAttempts)
    }
    
    return (

        <View style={styles.container}>
            <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: 'bold'}}>1. Enter a PIN Code</Text>
                </View>
                <View>
                    <Text>To keep your information secured</Text>
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
                            onPress={() => enterPin(code)}
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