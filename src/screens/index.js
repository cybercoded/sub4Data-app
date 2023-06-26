import { View, Text, Image } from 'react-native'
import React from 'react'
import { BASE_URL, styles } from '../components/global';
import { Button } from 'react-native-elements';

export const Index = ({navigation}) => {
  return (
    <View style={[styles.centerContainer, {justifyContent: 'center'} ]}>
        <View style={{width: '100%'}}>
            <View style={{marginBottom: 40, alignItems: 'center'}}>
                <Image style={{height: 100, width: 100}} source={{uri: `${BASE_URL}img/mtn-img.jpg`}} />
                <Text style={{marginVertical: 20, fontSize: 700}}>Hello! Let get you started</Text>
                <Text style={{textAlign: 'center'}}>Welcome to the best platform for all kinds of bills payment. Pay seamlessly and enjoy fast transactions</Text>
            </View>

            <View>
                <Button onPress={() => navigation.navigate('Signin') } type='outline' title='Sign in' buttonStyle={[styles.button, {backgroundColor: 'none', borderWidth: 1} ]} containerStyle={{width: '100%', marginBottom: 10}}/>
                <Button onPress={() => navigation.navigate('Registration', {referer: 'admin'}) } title='Create Free Account' buttonStyle={styles.button} containerStyle={{width: '100%'}}/>
            </View>
        </View>
    </View>
  )
};