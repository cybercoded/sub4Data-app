import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Button, Icon, Input, Text } from 'react-native-elements';
import { API, dimColor, styles, theme } from '../components/global';

export const TransacHistory = ({navigation}) => {

    const [histories, setSistories] = React.useState([]);

    useEffect(() => {
        
        API.get(`get-transactions.php`, {params: {userId: 5, pages:1, type: '', ref: '', keyword: ''}}).then((res) => {
            setSistories(res.data);
        });
    }, []);

    return (
        <View style={styles.centerContainer}>
            <View style={{width: '100%'}}>
                { histories.map( (list) => 
                    <View key={list.reference} style={[styles.rowFlex, {borderBottomWidth: 1, paddingVertical: 30, borderBottomColor: dimColor(theme.colors.gray, '.4')} ]}>
                        <View style={[styles.colomnFlex, {alignItems: 'flex-start'}]}>
                            <Text style={{fontSize: 13, fontSize: 700, color: theme.colors.gray}}>{list.date}</Text>
                            <Text style={{fontSize: 700, marginBottom: 20, marginTop: 5}}>{list.description}</Text>
                            <Button title={list.status} titleStyle={styles.miniButton} buttonStyle={[styles.miniButton, {backgroundColor: list.status == 'success' ? theme.color.primary : 'pink'}]} />
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                            <View style={[styles.colomnFlex, {alignItems: 'flex-end'} ]}>
                                <Text style={{fontSize: 700, fontSize: 25}}>N{list.amountOnly}</Text>
                                <Text style={{fontSize: 700, color: list.type == 'credits' ? 'green' : 'red'}}>{list.type}</Text>
                            </View>
                        </View>
                    </View>
                )}                
            </View>
        </View>
    )
};