import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { ListItem } from 'react-native-elements';
import { BASE_URL, ScrollViewHeader, styles } from '../components/global';
import isObject from 'lodash/isObject';
import upperFirst from 'lodash/upperFirst';
import { showAlert } from 'react-native-customisable-alert';
import axios from 'axios';

export const ViewProducts = ({ route, navigation }) => {
    const [availableServices, setAvailableServices] = React.useState([]);
    const { slug } = route.params;
    React.useEffect(() => {
        axios.get(`view-product/${slug}`).then((res) => {
            if (isObject(res.data)) {
                setAvailableServices(res.data.product);
            } else {
                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
            }
        });
    }, []);

    return (
        <>
            <View style={styles.centerContainer}>
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
        </>
    );
};