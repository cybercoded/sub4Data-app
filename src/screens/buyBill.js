import { View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { ScrollViewHeader, SearchHighlighter, getData, styles, theme } from '../components/global';
import { Button, Input, ListItem } from 'react-native-elements';
import { Formik } from 'formik';
import * as yup from 'yup';
import startCase from "lodash/startCase";
import { VerifyPin } from './verifyPin';
import { showAlert, closeAlert } from 'react-native-customisable-alert';
import axios from 'axios';
import Beneficiaries from '../components/beneficiaries';
import isArray from "lodash/isArray";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const BuyBill = ({ route, navigation }) => {
    const { id, name, image, amount, slug } = route.params;
    const formRef = React.useRef();
    const [pinScreen, setPinScreen] = React.useState(false);
    const [customerName, setCustomerName] = React.useState('');
    const [beneficiaries, setBeneficiaries] = React.useState([]);
    const [filterSearch, setFilterSearch] = React.useState([]);
    const [userData, setUserData] = React.useState([]);
    
    React.useEffect(() => {
        getData('basicData').then(res => {
            setUserData(res);
        });

        axios.get(`get-beneficiaries/${slug}`).then((res) => {
            setBeneficiaries(res.data.beneficiaries);
        });
    }, []);

    const handleVerifyPin = (smartcard_number, service_id) => {
        axios.post(`smartcard-verification`, {smartcard_number: smartcard_number, service_id: service_id}).then((res) => {
            if (res.data.status === 200) {
                setCustomerName(res.data.name);
                showAlert({alertType: 'success' , title: 'Success', message: 'Account successfully verified!'});
            } else {
                showAlert({alertType: 'error' , title: 'Error', message: 'please try again!'});
            }
        });
    };

    return (
        <>
            <View style={styles.centerContainer}>
                <View style={{ flex: 2 }}>
                    <ScrollViewHeader
                        image={{ uri: image }}
                        title={startCase(name)}
                        subTitle={`Wallet Balance = ${new Intl.NumberFormat().format(userData.balance)}`}
                    />
                </View>
                <View style={{ flex: 4, width: '100%' }}>
                    <Formik
                        innerRef={formRef}
                        validateOnChange={true}
                        initialValues={{
                            smartcard_number: '',
                            service_id: id,
                            amount: amount
                        }}
                        validateOnMount={true}
                        validationSchema={yup.object().shape({
                            smartcard_number: yup
                                .string()
                                .label('Card number')
                                .typeError('Must be only digits')
                                .required('Enter your your card number')
                                .min(10, 'Enter 10 digits!')
                                .max(10, 'Enter 10 digits!')
                        })}
                        onSubmit={(values) => {
                            axios.post(`bill-purchase`, values).then((res) => {
                              if (res.data.status === 2000) {
                                showAlert({
                                  alertType: "success",
                                  title: "Success",
                                  message: res.data.message,
                                });
                                delay(() => {
                                  closeAlert();
                                  navigation.navigate("Home");
                                }, 2000);
                              } else {
                                showAlert({
                                  alertType: "error",
                                  title: "Error",
                                  message: res.data.errors,
                                });
                              }
                            });
                        }}
                    >
                        {({ handleSubmit, handleChange, handleBlur, isValid, errors, touched, setFieldValue, values }) => (
                            <>
                                
                                <Input
                                    placeholder="Amount to purchase"
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    value={values.amount}
                                    disabled={true}
                                />
                                
                                <Input
                                    placeholder="Meter number"
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    value={values.smartcard_number}
                                    onChangeText={handleChange('smartcard_number')}
                                    onBlur={handleBlur('smartcard_number')}
                                    errorMessage={errors.smartcard_number && touched.smartcard_number && errors.smartcard_number}
                                    onFocus={() => {
                                        const filterSearch = beneficiaries.filter((item, index) => item.number.includes(values.smartcard_number));
                                        if(isArray(filterSearch)) {
                                          setFilterSearch(filterSearch);
                                        } else {
                                          setFilterSearch(beneficiaries)
                                        }
                                    }}
                                />
                                 <View>
                                    { (isArray(filterSearch) && values.smartcard_number.length > 0) && (
                                        <FlatList
                                        data={filterSearch}                            
                                        renderItem={({ item, index }) => (
                                            <ListItem
                                                key={index}
                                                Component={TouchableOpacity}
                                                bottomDivider={true}
                                                containerStyle={styles.productListStyle}
                                                onPress={() => {
                                                    setFieldValue('smartcard_number', item.number);
                                                    setFilterSearch([])
                                                }}
                                            >
                                                <ListItem.Content>                              
                                                    <ListItem.Title>
                                                        <SearchHighlighter values={item.number} value={values.smartcard_number} />
                                                    </ListItem.Title>
                                                    <ListItem.Subtitle>{item.name}</ListItem.Subtitle>
                                                </ListItem.Content>
                                                <MaterialCommunityIcons
                                                    size={30} 
                                                    color={theme.colors.dim} 
                                                    name="delete" 
                                                    onPress={() => deleteBeneficiary(item.id)} 
                                                />
                                            </ListItem>
                                        )}
                                        />
                                    )}
                                    <Beneficiaries
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        entity='smartcard_number'
                                    />
                                </View>                                

                                { customerName == '' ? (
                                    <Button
                                        title="Verify my meter number"
                                        // onPress={() => handleVerifyPin(values.smartcard_number, values.service_id)}
                                        onPress={() => setPinScreen(true) }
                                        buttonStyle={styles.button}
                                        containerStyle={{ marginTop: 20 }}
                                        disabled={!isValid}
                                    />
                                    ) : (
                                    <>
                                        <Input
                                            placeholder="Customer's name"
                                            disabled={true}
                                            inputContainerStyle={styles.input}
                                            containerStyle={{ paddingHorizontal: 0 }}
                                            value={customerName}
                                        />
                                        <Button
                                            title={pinScreen ? 'Purchase now' : 'Verify Transaction PIN'}
                                            onPress={() => setPinScreen(true) }
                                            disabled={!isValid}
                                            isSubmitting
                                            buttonStyle={styles.button}
                                            containerStyle={{ marginTop: 20 }}
                                        />
                                    </>
                                )}                               
                                
                            </>
                        )}
                    </Formik>
                </View>
            </View>

            <VerifyPin
                isVisible={pinScreen} 
                closePinScreen={() => setPinScreen(false)} 
                action={() =>  formRef.current.handleSubmit() }
                navigation={navigation}
            />
        </>
    );
};