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

export const ViewProducts = ({ route, navigation }) => {
    const { valueState, valueDispatch } = React.useContext(Context);
    const [availableServices, setAvailableServices] = React.useState([]);
    const { slug } = route.params;
    React.useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading, text: 'Fetching available services' } });
        API.get(`view-product/${slug}`).then((res) => {
            if (isObject(res.data)) {
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                setAvailableServices(res.data.product);
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
                        image= {{uri: `${BASE_URL}${availableServices[0]?.category?.image }`}}
                        title={upperFirst(slug) +" services"}
                        subTitle="Select from the list of services listed below"
                    />
                </View>

                <View style={{ flex: 5, width: '100%' }}>
                    <ScrollView>
                        { availableServices.map((item, index) => (
                                <ListItem
                                    key={index}
                                    Component={TouchableOpacity}
                                    bottomDivider={true}
                                    containerStyle={styles.productListStyle}
                                    onPress={() =>
                                        navigation.navigate(upperFirst(slug) === 'Airtime' ? 'Buy'+upperFirst(slug) : 'ViewServices', {
                                            api_product_id: item.api_product_id,
                                            id: item.id,
                                            image: BASE_URL+item.image,
                                            slug: slug
                                        })
                                    }
                                >
                                    <Image 
                                        source={{ uri: BASE_URL+item.image}} 
                                        style={{height: 50, width: 50}}
                                        resizeMode="contain"
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title>{item.name}</ListItem.Title>
                                        {/* <ListItem.Subtitle>{item.description}</ListItem.Subtitle> */}
                                    </ListItem.Content>
                                    <ListItem.Chevron size={40} />
                                </ListItem>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>

            <Loader 
                props={valueState.loader} 
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} 
            />
        </>
    );
};