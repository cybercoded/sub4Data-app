import { LinearGradient } from 'expo-linear-gradient';
import React, { Fragment } from 'react';
import { FlatList, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { API, Loader, styles, theme } from '../components/global';
import { Context } from '../components/userContext';
import { dummies } from '../components/dummies';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useToast } from 'react-native-toast-notifications';

export const AutomatedBanks = ({navigation}) => {
    const toast = useToast();
    const { valueState, valueDispatch } = React.useContext(Context);
    const [bankList, setBankLists] = React.useState([]);

    React.useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } }); 
        API.get(`get-user`).then((res) => {
            if ( res.data.status === 200) {
                setBankLists(res.data.data.banks);
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
            } else {
                valueDispatch({ loader: { ...dummies.modalProcess.error, text: res.data.errors } });   
            }
        }).catch(error => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: error.message } });
        });

    }, []);

    return (
        <>
            <View style={styles.centerContainer}>
                <View style={{flex: 1, width: '100%'}}>
                { bankList.map((item, index) => (
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
                    ))
                }
                </View>
            </View>

            <Loader
                props={valueState.loader} 
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} 
            />
        </>
    );
};