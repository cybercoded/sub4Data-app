import { View, Text } from 'react-native'
import React from 'react'
import { Button, Icon, Input } from 'react-native-elements';
import { styles, theme } from '../components/global';

export const Profile = ({navigation}) => {
  return (
    <View style={styles.centerContainer}>
        <View style={{width: '100%'}}>
            <View style={{alignItems: 'flex-start', marginBottom: 15}}>
                <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
                    <Icon name="account-circle" size={20} color={theme.colors.gray} />
                    <Text style={{fontSize: 700, marginStart: 10, color: theme.colors.gray}}>Username:</Text>
                </View>
                <Input value='kunley247' disabled={true} inputContainerStyle={styles.input} containerStyle={{paddingHorizontal: 0}} inputStyle={{outline: 0}} />
            </View>

            <View style={{alignItems: 'flex-start', marginBottom: 15}}>
                <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
                    <Icon name="account-circle" size={20} color={theme.colors.gray} />
                    <Text style={{fontSize: 700, marginStart: 10, color: theme.colors.gray}}>Fullname:</Text>
                </View>
                <Input value='Oluwadare Tomiwa Kunle' inputContainerStyle={styles.input} containerStyle={{paddingHorizontal: 0}} inputStyle={{outline: 0}} />
            </View>

            <View style={{alignItems: 'flex-start', marginBottom: 15}}>
                <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
                    <Icon name="account-circle" size={20} color={theme.colors.gray} />
                    <Text style={{fontSize: 700, marginStart: 10, color: theme.colors.gray}}>Email</Text>
                </View>
                <Input value='cafeat9ja@gmail.com' inputContainerStyle={styles.input} containerStyle={{paddingHorizontal: 0}} inputStyle={{outline: 0}} />
            </View>

            <View style={{alignItems: 'flex-start', marginBottom: 15}}>
                <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
                    <Icon name="account-circle" size={20} color={theme.colors.gray} />
                    <Text style={{fontSize: 700, marginStart: 10, color: theme.colors.gray}}>Phone:</Text>
                </View>
                <Input value='09036989565' inputContainerStyle={styles.input} containerStyle={{paddingHorizontal: 0}} inputStyle={{outline: 0}} />
            </View>

            <Button title='Proceed' buttonStyle={styles.button} containerStyle={{marginVertical: 20}}/>
            
        </View>
    </View>
  )
};