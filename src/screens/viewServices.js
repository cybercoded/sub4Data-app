import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { ListItem } from 'react-native-elements';
import { API, BASE_URL, Loader, ScrollViewHeader, styles, theme } from '../components/global';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import { FlatList } from 'react-native';
import isObject from 'lodash/isObject';
import { SafeAreaView } from 'react-native-safe-area-context';
import upperFirst from 'lodash/upperFirst';

export const ViewServices = ({ route, navigation }) => {
    const { valueState, valueDispatch } = React.useContext(Context);
    const [availableServices, setAvailableServices] = React.useState([]);
    const { id, slug, image } = route.params;
    React.useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading, text: 'Fetching available options' } });
        API.get(`view-services/${id}`).then((res) => {
            if (isObject(res.data)) {
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                setAvailableServices(res.data.services);
            }
        })
        .catch((error) => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: error } });
        });
    }, []);

    return (
        <>
            <View style={styles.container}>
                <View style={{ flex: 2 }}>
                    <ScrollViewHeader
                        image= {{uri: image}}
                        title={upperFirst(slug) +" services"}
                        subTitle="Select from the list of services listed below"
                    />
                </View>

                <View style={{ flex: 5, width: '100%' }}>
                    <SafeAreaView>
                        <FlatList
                            data={availableServices}
                            
                            renderItem={({ item, index }) => (
                                <ListItem
                                    key={index}
                                    Component={TouchableOpacity}
                                    bottomDivider={true}
                                    containerStyle={styles.productListStyle}
                                    onPress={() =>
                                        navigation.navigate(`Buy${upperFirst(slug)}`, {
                                            id: item.id,
                                            image: image,
                                            slug: slug,
                                            amount: item.price,
                                            name: item.name
                                        })
                                    }
                                >
                                    <ListItem.Content>
                                        <ListItem.Title>{item.name}</ListItem.Title>
                                        {/* <ListItem.Subtitle>{item.description}</ListItem.Subtitle> */}
                                    </ListItem.Content>
                                    <ListItem.Chevron size={40} />
                                </ListItem>
                            )}
                        />
                    </SafeAreaView>
                </View>
            </View>

            <Loader 
                props={valueState.loader} 
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} 
            />
        </>
    );
};