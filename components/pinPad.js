import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { API, Loader, storeData, styles, theme } from './global';
import { Context } from './userContext';
import { Icon } from 'react-native-elements';
import indexOf from 'lodash/indexOf';
import delay from 'lodash/delay';
import { dummies } from './dummies';
import isEmpty from 'lodash/isEmpty';

export const PinPad = (props) => {

    const {valueState, valueDispatch} = React.useContext(Context);

    const BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, <Icon size={30} color={theme.colors.primary} name='backspace' />];
    const [selectedPIN, setSelectedPIN] = React.useState();
    const [titleText, setTitleText] = React.useState(props.title);
    const [pinResponseText, setPinResponseText] = React.useState(<Text>To keep your information secured</Text>);

    return (
      <>
        <View style={styles.container}>
            <Loader
                props={valueState.loader}
                handler={() => valueDispatch({loader: {...dummies.modalProcess.hide}})}
            />
            <View style={{flex: 1, alignItems: 'center'}}>
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: 'bold'}}>
                        {titleText}
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
                            props.pinCode[codeIndex] ? (
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
                        alignContent: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                {
                BUTTONS.map((code, codeIndex) => (
                    <View style={{ flexBasis: '30%' }} key={codeIndex}>
                        <TouchableOpacity                    
                            onPress={() => {
                                props.handler(code)
                                setSelectedPIN(code)
                            }}
                            style={{
                                backgroundColor: theme.colors[selectedPIN === code && !isEmpty(props.pinCode) ? 'primary' : 'dimmer'],
                                height: 80,
                                width: 80,
                                borderRadius: 50,
                                justifyContent: 'center',
                                marginVertical: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors[selectedPIN === code && !isEmpty(props.pinCode) ? 'white' : 'dim'],
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
      </>
    )
};