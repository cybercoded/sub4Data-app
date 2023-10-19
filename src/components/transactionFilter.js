import React from "react";
import {View} from "react-native";
import {Formik} from "formik";
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { showAlert, closeAlert } from 'react-native-customisable-alert';
import { Button, Input, Text } from 'react-native-elements';
import axios from "axios";
import { styles, theme } from "../components/global";

const TransactionFilter = () => {
    const [showDateFrom, setShowDateFrom] = React.useState(false);
    const [showDateTo, setShowDateTo] = React.useState(false);
    const [productList, setProductList] = React.useState([]);
    const [serviceList, setServiceList] = React.useState([]);
    const [selectedProduct, setSelectedProduct] = React.useState();
    
    const fetchServices = () => {
        axios.get(`view-services/${selectedProduct}`).then((res) => {
            setServiceList(res.data.services);
        });
    };

    React.useEffect(() => {
        axios.get(`view-product`).then((res) => {
            setProductList(res.data.product);
        });
    }, []);
    return (
        <View style={{width: 300, backgroundColor: theme.colors.white, borderRadius: 20, padding: 20}}>
            <Formik
                initialValues={{
                    search: '',
                    from: new Date(),
                    to: new Date()
                }}
                onSubmit={(values) => {
                    closeAlert();
                    axios.post(`filter-transactions`, values).then((res) => {
                        if(res.data.status === 200) {
                            setHistories(res.data.data);
                        }
                        else {
                            showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
                        }
                    });
                }}
            >
                {({ values, setFieldValue, isValid, handleSubmit }) => (
                    <>
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
                            disabled={true}
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
                            disabled={true}
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
                        <View style={[styles.rowFlex, {justifyContent: 'flex-end', marginTop: 20}]}>
                            <Button
                                title="Cancel"
                                type="outline"
                                onPress={() => closeAlert() }
                                style={{marginRight: 10}}
                            />
                            <Button
                                title="Filter"
                                disabled={!isValid}
                                onPress={handleSubmit}
                            />
                        </View>
                    </>
                )}
            </Formik>
        </View>
    );
};

export default TransactionFilter;