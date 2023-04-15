import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { API, Loader,ScrollViewHeader, SkeletonView, styles } from '../components/global';
import { Badge, ListItem } from 'react-native-elements';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import { isEmpty } from 'lodash';

export const Cable = ({ route, navigation }) => {
    const { sub_service_code, sub_service_image, sub_service_name } = route.params;
    const [buttonChange, setbuttonChange] = useState(null);
    const [dataOptions, setDataOptions] = useState([]);
    const [mainOptions, setMainOptions] = useState([]);

    const { valueState, valueDispatch } = React.useContext(Context);

    useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });
        API.post(`get-sub-services.php?userId=${valueState.basicData?.userId}&service=others/get_available_services.php`, {
            service_code: 'sme_data_share',
            sub_service_code: sub_service_code
        })
            .then((res) => {
                setDataOptions(res.data.data);
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
            })
            .catch((error) => {
                console.log(error);
                valueDispatch({ loader: { ...dummies.modalProcess.error, text: error.message } });
            });
    }, [JSON.stringify(valueState.basicData)]);

    const buttons = mainOptions?.map((list) => <Text>{list.sub_service_name}</Text>);

    return (
        <SafeAreaView style={styles.container}>
            <Loader
                submittion={() => changeOption(buttonChange)}
                props={valueState.loader}
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })}
            />
            <View style={{ flex: 2 }}>
                <ScrollViewHeader
                    image={sub_service_image}
                    title={sub_service_name}
                    subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}
            ></View>
            <View style={{ flex: 7, width: '100%' }}>
                {isEmpty(dataOptions) && (
                    <SkeletonView length={6} />
                )}
                {dataOptions?.map((item, index) => (
                    <ListItem
                        key={index}
                        Component={TouchableOpacity}
                        bottomDivider={true}
                        onPress={() =>
                            navigation.navigate('BuyCable', {
                                sub_service_image: sub_service_image,
                                product_code: item.product_code,
                                sub_service_name: item.available_service_name,
                                amount: item.available_service_default_price
                            })
                        }
                    >
                        <ListItem.Content>
                            <ListItem.Title>{item.available_service_name}</ListItem.Title>
                            <ListItem.Subtitle>{item.available_service_description}</ListItem.Subtitle>
                        </ListItem.Content>
                        <Badge value={item.available_service_default_price} status="warning" />
                    </ListItem>
                ))}
            </View>
        </SafeAreaView>
    );
};
