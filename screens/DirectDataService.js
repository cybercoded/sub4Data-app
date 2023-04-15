import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { Button, Icon, Input, ListItem } from 'react-native-elements';
import { API, Loader, ScrollViewHeader, styles, theme } from '../components/global';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import { FlatList } from 'react-native';
import isObject from 'lodash/isObject';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DirectDataService = ({ route, navigation }) => {
    const { valueState, valueDispatch } = React.useContext(Context);
    const [availableServices, setAvailableServices] = React.useState([]);

    React.useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading, text: 'Fetching available services' } });
        API.post(`get-sub-services.php?userId=1&service=others/get_sub_services.php`, {
            service_code: 'data_topup'
        })
        .then((res) => {
            if (isObject(res.data)) {
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                setAvailableServices(res.data.data);
            }
        })
        .catch((error) => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: error } });
            console.error(error);
        });
    }, []);

    const serviceImage = {uri: `https://smartrecharge.ng/images/services/baa06877f9cc2305bf6d2fa1e1cf6695f3dba8d8990efc3dfb028a0a3b1510a24941453ca663cef4e722c7aab10c2bed6a9cb4b318542a11e235bb0fac9e7665.png`};

    return (
        <>
            <View style={styles.container}>
                <View style={{ flex: 2 }}>
                    <ScrollViewHeader
                        image={serviceImage}
                        title="Available services"
                        subTitle="Select from the list of services listed below"
                    />
                </View>

                <View style={{ flex: 4, width: '100%' }}>
                    <SafeAreaView>
                        {
                            <FlatList
                                data={availableServices}
                                renderItem={({ item, index }) => {
                                    const image = item.main_service_logo 
                                        ? `https://smartrecharge.ng/images/services/${item.main_service_logo}`
                                        : dummies.images[item.sub_service_code.replace('direct', 'shared')]
                                    return (
                                        <ListItem
                                            key={index}
                                            Component={TouchableOpacity}
                                            bottomDivider={true}
                                            onPress={() =>
                                                navigation.navigate('Data', {
                                                    sub_service_code: item.sub_service_code,
                                                    sub_service_name: item.sub_service_name,
                                                    serviceImage: serviceImage
                                                })
                                            }
                                        >
                                            <Image 
                                                source={image} 
                                                style={{height: 50, width: 50}}
                                            />
                                            <ListItem.Content>
                                                <ListItem.Title>{item.sub_service_name}</ListItem.Title>
                                                <ListItem.Subtitle>{item.main_service_description}</ListItem.Subtitle>
                                            </ListItem.Content>
                                            <ListItem.Chevron size={40} />
                                        </ListItem>
                                    );
                                }}
                            />
                        }
                    </SafeAreaView>
                </View>
            </View>

            <Loader props={valueState.loader} handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} />
        </>
    );
};
