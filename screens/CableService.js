import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { Button, Icon, Input, ListItem } from 'react-native-elements';
import { API, Loader, ScrollViewHeader, SkeletonView, styles, theme } from '../components/global';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import { FlatList, SafeAreaView } from 'react-native';
import isObject from 'lodash/isObject';
import { isEmpty } from 'lodash';

export const CableService = ({ route, navigation }) => {
    const { valueState, valueDispatch } = React.useContext(Context);

    const [availableServices, setAvailableServices] = React.useState([]);

    React.useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading, text: 'Fetching available services' } });
        API.post(`get-sub-services.php?userId=1&service=others/get_sub_services.php`, {
            service_code: 'cable_subscription'
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

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 2 }}>
                    <ScrollViewHeader
                        image= {{uri: `https://smartrecharge.ng/images/services/f3b30c0b822a3a7c30ac446e5fa3891a494b599c319b0207dc715a90e64c8c30b30c9e25f56677aed7ad922ad36985d80724658afd92c1abd4e303dac0411c6b.png`}}
                        title="Available services"
                        subTitle="Select from the list of services listed below"
                    />
                </View>

                <View style={{ flex: 4, width: '100%' }}>
                    {isEmpty(availableServices) && (
                      <SkeletonView length={3} />
                    )}
                    <FlatList
                        data={availableServices}
                        renderItem={({ item, index }) => {
                            const image = item.main_service_logo 
                                ? `https://smartrecharge.ng/images/services/${item.main_service_logo}`
                                : dummies.images[item.sub_service_code]
                            return (
                                <ListItem
                                    key={index}
                                    Component={TouchableOpacity}
                                    bottomDivider={true}
                                    onPress={() =>
                                        navigation.navigate('Cable', {
                                            sub_service_code: item.sub_service_code,
                                            sub_service_name: item.sub_service_name,
                                            sub_service_image: image
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
                </View>
            </SafeAreaView>

            <Loader props={valueState.loader} handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} />
        </>
    );
};
