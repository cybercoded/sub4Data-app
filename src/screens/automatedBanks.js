import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { styles, theme, getData } from '../components/global';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useToast } from 'react-native-toast-notifications';
import { showAlert } from 'react-native-customisable-alert';
import axios from "axios";
import delay from 'lodash/delay';

export const AutomatedBanks = ({navigation}) => {
    const toast = useToast();
    const [bankList, setBankLists] = React.useState([]);

    React.useEffect(() => {
        getData("basicData").then((res) => {
            setBankLists(res.banks);
        });

    }, []);

    const createAutomatedBanks = () => {
        axios.post(`create-automated-banks`).then((res) => {
            if ( res.data.status === 200 ) {
                showAlert({alertType: 'success' , title: 'Success', message:  res.data.message});
                axios.get(`get-user`).then((res) => {
                    storeData('basicData', {...res.data.data});
                                        
                    delay(() => {
                        closeAlert();
                        navigation.navigate('Home')
                    }, 2000);  
                })
            }
        });   
    }

    return (
        <>
            <View style={styles.centerContainer}>
                <View style={{flex: 1, width: '100%'}}>
                <FlatList
                    data={bankList}
                    ListEmptyComponent={() => <Card>
                        <Card.Title>No banks found</Card.Title>
                        <Button type='clear' buttonStyle={styles.button} onPress={createAutomatedBanks} title="Create an Automated Bank" />
                    </Card>}
                    renderItem={({ item, index }) => (
                        <LinearGradient
                            key={index}
                            colors={[theme.colors.primary, "#189f91"]}
                            start={{ x: 0, y: 0.2 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 30,
                                borderRadius: 10,
                                marginBottom: 20
                            }}
                        >
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: 50}}>
                                <Text style={{ color: "#fff", fontWeight: 'bold' }}>{item.bank_name}</Text>
                                <MaterialCommunityIcons
                                    name="content-copy"
                                    color="#fff"
                                    size={40}
                                    onPress={() => {
                                        Clipboard.setStringAsync(item.account_number)
                                        toast.show('Account number copied')
                                    }}
                                />
                            </View>
                            
                            <Text
                                style={{
                                    marginBottom: 10,
                                    color: "#fff",
                                    fontSize: 30,
                                    fontWeight: "bold",
                                }}
                            >
                                <Text style={{fontSize: 12, color: '#fff'}}>Account number{"\n"}</Text>{item.account_number}
                            </Text>
                            
                            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                                <Text style={{fontSize: 12, color: '#fff'}}>Account name{"\n"}</Text>{item.account_name}
                            </Text>
                        </LinearGradient>
                    )}
                />
                </View>
            </View>
        </>
    );
};