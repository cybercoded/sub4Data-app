import { TouchableOpacity, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native'
import React, { Fragment, useEffect } from 'react'
import { Badge, Button, Icon, Input, ListItem, Overlay, SearchBar, Text } from 'react-native-elements';
import { API, Loader, MyDatePicker, ReferencePreviewer, styles, theme } from '../components/global';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';
import { Context } from '../components/userContext';
import { dummies } from '../components/dummies';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const TransactionHistory = ({navigation}) => {
    const [histories, setHistories] = React.useState([]);
    const { valueState, valueDispatch } = React.useContext(Context);
    const [referenceScreenIsVisible, setReferenceScreenIsVisible] = React.useState(false);
    const [filterScreenIsVisible, setFilterScreenIsVisible] = React.useState(false);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [isLoadingMoreTextResponse, setIsLoadingMoreTextResponse] = React.useState();
    const [limit, setLimit] = React.useState(10);
    const [productList, setProductList] = React.useState([]);
    const [serviceList, setServiceList] = React.useState([]);
    const [singleTransaction, setSingleTransaction] = React.useState([]);
    const [selectedProduct, setSelectedProduct] = React.useState();    
    const [dateFrom, setDateFrom] = React.useState();    
    const [dateTo, setDateTo] = React.useState();
    const scrollRef = React.useRef();
    const [showDateFrom, setShowDateFrom] = React.useState(false);
    const [showDateTo, setShowDateTo] = React.useState(false);

    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });      
        API.get(`view-transactions/${limit}`).then((res) => {
            if(res.data.status === 200) {
                setHistories(res.data.data);
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
            }
            else {
                valueDispatch({ loader: { ...dummies.modalProcess.error, text: res.data.errors } });
            }
        });

        API.get(`view-product`).then((res) => {
            setProductList(res.data.product);
        });
    }, []);

    const handleDate = (date) => {
        let dbDate = new Date( Date.parse(date));
        let userDate = dbDate.toUTCString();

        return userDate;
    }

    const handleFetchMore = () => {  
        if (isLoadingMore === false) {
            setIsLoadingMore(true)
            setLimit(limit+10)
            API.get(`view-transactions/${limit === 10 ? 20 : limit}`).then((res) => {
                if(res.data.status === 200) {
                    setHistories([...res.data.data, ...histories]);
                    scrollRef.current.scrollTo({x: 0, y: 0, animated: true});                  
                    setIsLoadingMore(false)     
                }
                else {
                    setIsLoadingMoreTextResponse(res.data.errors);
                }
            });
        }
    };

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        const scrollHeight = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

        return scrollHeight;
    };

    const fetchServices = () => {
        API.get(`view-services/${selectedProduct}`).then((res) => {
            setServiceList(res.data.services);
        });
    };

    return (
        <View style={styles.centerContainer}>
            <View style={{width: '100%'}}>
                <ScrollView 
                    ref={scrollRef}
                    style={{height: windowHeight-100}}
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                            handleFetchMore();
                        }
                    }}
                    scrollEventThrottle={400}
                >
                    <ListItem style={{marginBottom: 20}}  onPress={() => setFilterScreenIsVisible(true) } bottomDivider>
                        <Icon name='search' size={30} />
                        <ListItem.Content>
                            <ListItem.Title>Filter Transactions</ListItem.Title>
                        </ListItem.Content>
                        <MaterialCommunityIcons name='chevron-double-down' size={30} />
                    </ListItem>
                    
                    {histories.map((item, index) => (
                            <ListItem
                                key={index}
                                Component={TouchableOpacity}
                                bottomDivider={true}
                                containerStyle={styles.productListStyle}
                                onPress={() => {
                                    setReferenceScreenIsVisible(true);
                                    setSingleTransaction(item)
                                }}
                            >
                                <ListItem.Content>
                                    <ListItem.Title>{item.description}</ListItem.Title>
                                    <ListItem.Subtitle>{handleDate(item.created_at)}</ListItem.Subtitle>
                                </ListItem.Content>
                                <Badge 
                                    value={item.status} 
                                    status={
                                        item.status == 'success' && 'success' 
                                        ||  item.status == 'failed' && 'error' 
                                        || item.status == 'pending' && 'warning'
                                    } 
                                />                       
                            </ListItem>
                        ))
                    }
                    <View style={{flex: 1, alignItems: 'center'}}>
                        { isLoadingMore && 
                            <ActivityIndicator size='large' color={theme.colors.dim} /> 
                        }
                        <Text>
                            {isLoadingMoreTextResponse}
                        </Text>
                    </View>
                    
                </ScrollView>
            </View>
            <Loader 
                props={valueState.loader} 
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} 
            />
            <ReferencePreviewer
                referenceScreenIsVisible={referenceScreenIsVisible}
                singleTransaction={singleTransaction}
                setReferenceScreenIsVisible={() => setReferenceScreenIsVisible(false) }
            />

            <Overlay isVisible={filterScreenIsVisible} onBackdropPress={() => setFilterScreenIsVisible(false)}>
                <View style={{width: 300, borderRadius: 20, padding: 20}}>
                    <Formik
                        initialValues={{
                            search: '',
                            from: new Date(),
                            to: new Date()
                        }}
                        onSubmit={(values) => {
                            setFilterScreenIsVisible(false);
                            valueDispatch({ loader: { ...dummies.modalProcess.loading } });      
                            API.post(`filter-transactions`, values).then((res) => {
                                if(res.data.status === 200) {
                                    setHistories(res.data.data);
                                    valueDispatch({ loader: { ...dummies.modalProcess.hide } });                                    
                                }
                                else {
                                    valueDispatch({ loader: { ...dummies.modalProcess.error, text: res.data.errors } });
                                }
                            });
                        }}
                    >
                        {({ values, setFieldValue, isValid, handleSubmit }) => (
                            <Fragment>
                                <View>
                                    <Input
                                        placeholder="Type Here..."
                                        value={values.search}
                                        inputContainerStyle={[styles.input, {paddingVertical: 5}]}
                                        containerStyle={{ paddingHorizontal: 0 }}
                                        onChangeText={(text) => setFieldValue('search', text)}              
                                    />
                                </View>
                                <View style={{marginBottom: 10}}>
                                    <Picker
                                        style={styles.input}
                                        mode='dropdown'
                                        selectedValue={values.type}
                                        onValueChange={(itemValue, itemIndex) => 
                                            setFieldValue('type', itemValue)
                                        }
                                    >
                                        <Picker.Item value="" label="Select Transaction Type "/>
                                        <Picker.Item value="debit" label="Debit"/>
                                        <Picker.Item value="credit" label="Credit"/>
                                        <Picker.Item value="debit_transfer" label="Debit Transfer"/>
                                        <Picker.Item value="credit_transfer" label="Credit Transfer"/>
                                    </Picker>
                                </View>
                                
                                <View style={{marginBottom: 10}}>
                                    <Picker
                                        style={styles.input}
                                        mode='dropdown'
                                        selectedValue={values.type}
                                        onValueChange={(itemValue, itemIndex) => 
                                            setFieldValue('status', itemValue)
                                        }
                                    >
                                        <Picker.Item value="" label="Select Transaction Status "/>
                                        <Picker.Item value="success" label="Success"/>
                                        <Picker.Item value="failed" label="Failed"/>
                                        <Picker.Item value="pending" label="Pending"/>
                                    </Picker>
                                </View>

                                <View style={{marginBottom: 10}}>
                                    <Picker
                                        style={styles.input}
                                        mode='dropdown'
                                        selectedValue={values.product}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setFieldValue('product', itemValue);
                                            setSelectedProduct(itemValue)
                                            fetchServices();
                                        }}
                                    >
                                        <Picker.Item value="" label="Select Product"/>
                                        { productList.map((item, index) => (
                                            <Picker.Item key={index} value={item.id} label={item.name}/>
                                        ))}
                                    </Picker>
                                </View>
                                { !isEmpty(serviceList) &&
                                    <View style={{marginBottom: 10}}>
                                        <Text style={{marginBottom: 5}}>Services</Text>
                                        <Picker
                                            style={styles.input}
                                            mode='dropdown'
                                            selectedValue={values.service}
                                            onValueChange={(itemValue, itemIndex) => {
                                                setFieldValue('service', itemValue);
                                                setSelectedProduct(itemValue)
                                            }}
                                        >
                                            <Picker.Item value="" label="Select Service"/>
                                            { serviceList?.map((item, index) => (
                                                <Picker.Item key={index} value={item.id} label={item.name}/>
                                            ))}
                                        </Picker>
                                    </View>
                                }
                                { showDateFrom && 
                                    <DateTimePicker
                                        value={values.from}
                                        mode='date'
                                        dateFormat="DD-MM-YYYY"
                                        onChange={(e, date) => {
                                            setFieldValue('from', date);
                                            setShowDateFrom(false)
                                        }}
                                    />
                                }
                                { showDateTo &&
                                    <DateTimePicker
                                        value={values.to}
                                        mode='date'
                                        dateFormat="DD-MM-YYYY"
                                        onChange={(e, date) => {
                                            setFieldValue('to', date);
                                            setShowDateTo(false)
                                        }}
                                    />
                                }
                                
                                <Input
                                    placeholder='Select date from'
                                    value={values.from.toLocaleString()}
                                    inputContainerStyle={[styles.input, {paddingVertical: 5}]}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    leftIcon={
                                        <MaterialCommunityIcons
                                            name="calendar-clock"
                                            size={25}
                                            color={theme.colors.primary}
                                            onPress={() => setShowDateFrom(true)}
                                        />
                                    }
                                />
                                
                                <Input
                                    placeholder='Select date to'
                                    value={values.to.toLocaleString()}
                                    inputContainerStyle={[styles.input, {paddingVertical: 5}]}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    leftIcon={
                                        <MaterialCommunityIcons
                                            name="calendar-clock"
                                            size={25}
                                            color={theme.colors.primary}
                                            onPress={() => setShowDateTo(true)}
                                        />
                                    }
                                />

                                <Button onPress={handleSubmit} title="Filter" buttonStyle={[styles.button, {width: 200, alignSelf: 'center'}]} />
                            </Fragment>
                        )}
                    </Formik>
                </View>
        </Overlay>
    </View>
    )
};