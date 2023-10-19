import { View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { ScrollViewHeader, SearchHighlighter, getData, styles } from '../components/global';
import { Button, Input, ListItem } from 'react-native-elements';
import { Formik } from 'formik';
import { dummies } from '../components/dummies';
import * as yup from 'yup';
import startCase from "lodash/startCase";
import { VerifyPin } from './verifyPin';
import { showAlert, closeAlert } from 'react-native-customisable-alert';
import axios from 'axios';
import Beneficiaries from '../components/beneficiaries';
import isArray from "lodash/isArray";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const BuyElectricity = ({ route, navigation }) => {
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
    }, []);

    const handleVerifyPin = (meter_number, service_id) => {
        axios.post(`meternumber-verification`, {meter_number: meter_number, service_id: service_id}).then((res) => {
            if (res.data.status === 200) {
                setCustomerName(res.data.name);
                showAlert({alertType: 'success' , title: 'Success', message: 'Account successfully verified'});
            } else {
                showAlert({alertType: 'success' , title: 'Success', message: res.data.errors});
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
                <View style={{ flex: 6, width: '100%' }}>
                    <Formik
                        innerRef={formRef}
                        validateOnChange={true}
                        initialValues={{
                            meter_number: '',
                            service_id: id,
                            amount: ''
                        }}
                        validateOnMount={true}
                        validationSchema={yup.object().shape({
                            meter_number: yup
                                .string()
                                .label('Card number')
                                .typeError('Must be only digits')
                                .required('Enter your your card number')
                                .min(11, 'Enter 11 digits!')
                                .max(11, 'Enter 11 digits!'),
                            amount: yup
                                .number()
                                .typeError('Must be only digits')
                                .label('Amount to purchase')
                                .required('Enter amount to purchase')
                                .min(200, 'Enter N200 and above!')
                                .max(2000, 'Enter N20,000 and above!')
                        })}
                        onSubmit={(values) => {
                            axios.post(`electricity-purchase`, values).then((res) => {
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
                                    keyboardType='number-pad'
                                    onChangeText={handleChange('amount')}
                                    onBlur={handleBlur('amount')}
                                    errorMessage={errors.amount && touched.amount && errors.amount}
                                />

                                <Input
                                    placeholder="Meter number"
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    value={values.meter_number}
                                    onChangeText={handleChange('meter_number')}
                                    onBlur={handleBlur('meter_number')}
                                    keyboardType='number-pad'
                                    errorMessage={errors.meter_number && touched.meter_number && errors.meter_number}
                                    onKeyPress={() => {
                                        setShowBeneficiaries(true);
                                        const filterSearch = beneficiaries.filter((item, index) => item.number.includes(values.meter_number));
                                        if(isArray(filterSearch)) {
                                          setFilterSearch(filterSearch);
                                        } else {
                                          setFilterSearch(beneficiaries)
                                        }
                                    }}
                                />
                                
                                <View>
                                    { ( (isArray(filterSearch) && values.meter_number.length > 0)) && (
                                    <FlatList
                                        data={filterSearch}                            
                                        renderItem={({ item, index }) => (
                                            <ListItem
                                                key={index}
                                                Component={TouchableOpacity}
                                                bottomDivider={true}
                                                containerStyle={styles.productListStyle}
                                                onPress={() => {
                                                    setFieldValue('meter_number', item.number);
                                                    setFilterSearch([])
                                                }}
                                            >
                                                <ListItem.Content>                              
                                                    <ListItem.Title>
                                                    <SearchHighlighter values={item.number} value={values.meter_number} />
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
                                    entity='meter_number'
                                    />
                                </View>

                                { customerName == '' ? (
                                    <Button
                                        title="Verify my meter number"
                                        // onPress={() => handleVerifyPin(values.meter_number, values.service_id)}
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
