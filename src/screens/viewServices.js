import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Card, ListItem } from 'react-native-elements';
import { ScrollViewHeader, styles } from '../components/global';
import { FlatList } from 'react-native';
import isObject from 'lodash/isObject';
import upperFirst from 'lodash/upperFirst';
import { showAlert } from 'react-native-customisable-alert';
import axios from 'axios';
import { ScrollView } from 'react-native-web';

export const ViewServices = ({ route, navigation }) => {
    const [availableServices, setAvailableServices] = React.useState([]);
    const { id, slug, image } = route.params;
    React.useEffect(() => {
        axios.get(`view-services/${id}`).then((res) => {
            if (isObject(res.data)) {
                setAvailableServices(res.data.services);
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
                        image= {{uri: image}}
                        title={upperFirst(slug) +" services"}
                        subTitle="Select from the list of services listed below"
                    />
                </View>

                <View style={{ flex: 5, width: '100%' }}>
                    <ScrollView>
                        <FlatList
                            data={availableServices}
                            ListEmptyComponent={() => <Card>
                                <Card.Title>No {slug} service found</Card.Title>
                            </Card>}                         
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
                    </ScrollView>
                </View>
            </View>
        </>
    );
};