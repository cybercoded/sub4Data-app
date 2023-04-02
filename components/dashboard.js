import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme, styles } from './global';
import { Icon } from 'react-native-elements';

export const FundwalletComponets = () => {
  return (
    <View style={{backgroundColor: theme.colors.dim, padding: 20, borderTopStartRadius: 20, borderTopEndRadius: 20}}>
      <View>
        <Text style={{fontSize: 700, textAlign: 'center'}}>{dummies.fundWallet.labels.header}</Text>
        <Text>{dummies.fundWallet.labels.subHeader}</Text>
      </View>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap'}}>
        { dummies['fundWallet']['lists'].map((list) => 
            <View key={list.id} style={[styles.menuListStyle, {flex: '40%'} ]}>
              <Icon
                color={theme.color.primary}
                size={40}
                name={list.iconName}
              />
              <Text>{list.text}</Text>
            </View>
        )}
        
      </View>
    </View>
  )
};