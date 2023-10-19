import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles, theme } from './global';
import { Text, Icon } from 'react-native-elements';
import isEmpty from 'lodash/isEmpty';

export const PinPad = (props) => {

    const BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, <Icon size={30} color={theme.colors.primary} name='backspace' />];
    const [selectedPIN, setSelectedPIN] = React.useState(null);
    return (
      <>
        <View style={styles.centerContainer}>
            <View style={{flex: 1, alignItems: 'center'}}>
                <View style={{marginBottom: 15}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>
                        {props.title}
                    </Text>
                </View>
                <Text>To keep your information secured</Text>
            </View>
            
            <View style={{flex: 1}}>
                <View style={[styles.rowFlex, { width: 80 }]}>                    
                    <View style={[styles.dots, {backgroundColor: props.pinCode.length >= 1 ? theme.colors.primary : theme.colors.dimmer}]}></View>                               
                    <View style={[styles.dots, {backgroundColor: props.pinCode.length >= 2 ? theme.colors.primary : theme.colors.dimmer}]}></View>                               
                    <View style={[styles.dots, {backgroundColor: props.pinCode.length >= 3 ? theme.colors.primary : theme.colors.dimmer}]}></View>                               
                    <View style={[styles.dots, {backgroundColor: props.pinCode.length >= 4 ? theme.colors.primary : theme.colors.dimmer}]}></View>                               
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