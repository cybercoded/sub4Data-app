import { View, FlatList } from 'react-native';
import React from 'react';
import { styles, theme, ScrollViewHeader, getData, storeData, SearchHighlighter } from '../components/global';
import { Button, Input, Switch, Text, ButtonGroup, Overlay, ListItem } from 'react-native-elements';
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';
import { Formik } from 'formik';
import * as yup from "yup";
import capitalize from "lodash/capitalize";
import { VerifyPin } from './verifyPin';
import axios from 'axios';
import { showAlert, closeAlert } from 'react-native-customisable-alert';
import Beneficiaries from '../components/beneficiaries';
import isArray from "lodash/isArray";

export const BuyData = ({ route, navigation }) => {
    const { slug, api_product_id, id, image, amount, name } = route.params;
    const [value, setValue] = React.useState(false);
    const [pinScreen, setPinScreen] = React.useState(false);
    const formRef = React.useRef();
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

    return (
        <>
            <View style={styles.centerContainer}>
                <View style={{flex: 2}}>
                    <ScrollViewHeader
                        image={image}
                        title={`Purchase ${capitalize(name)}`}
                        subTitle={`Wallet Balance = ${new Intl.NumberFormat().format(userData.balance)}`}
                    />
                </View>

                <View style={{flex: 6, width: '100%'}}>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            amount: amount,
                            phone: '',
                            service_id: id,
                            api_product_id: api_product_id,
                        }}
                        validateOnChange={true}
                        validateOnMount={true}
                        validationSchema={yup.object().shape({
                            phone: yup
                                .string()
                                .required("Enter your phone number")
                                .min(11, "Enter 11 digits format Nigerian phone number!")
                                .max(11, "Enter 11 digits format Nigerian phone number!")
                            
                        })}
                        onSubmit={(values) => {                    
                            axios.post(`data-purchase`, values).then((res) => {
                                if (res.data.status === true) {
                                    showAlert({alertType: 'success' , title: 'Success', message: 'please wait to be directed to Dashboard'});
                                    delay(() => {
                                        closeAlert();
                                        navigation.navigate('Dashboard');
                                    }, 2000);
                                } else {
                                    showAlert({alertType: 'error' , title: 'Error', message: res.data.errors + ' Try again later'});
                                }
                            });
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, errors, touched, values }) => (
                            <>
                                <Input
                                    disabled={true}
                                    value={name}
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                />
                                <Input
                                    disabled={true}
                                    value={amount}
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                />
                                <Input
                                    placeholder="Beneficiary number"
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    onChangeText={handleChange("phone")}
                                    onBlur={handleBlur("phone")}
                                    value={values.phone}
                                    errorMessage={errors.phone && touched.phone && errors.phone}
                                    onKeyPress={() => {
                                        const filterSearch = beneficiaries.filter((item, index) => item.number.includes(values.phone));
                                        if(isArray(filterSearch)) {
                                          setFilterSearch(filterSearch);
                                        } else {
                                          setFilterSearch(beneficiaries)
                                        }
                                    }}
                                />
                                <View>
                                    { (isArray(filterSearch) && values.phone.length > 0) && (
                                    <FlatList
                                        data={filterSearch}                            
                                        renderItem={({ item, index }) => (
                                            <ListItem
                                                key={index}
                                                Component={TouchableOpacity}
                                                bottomDivider={true}
                                                containerStyle={styles.productListStyle}
                                                onPress={() => {
                                                    setFieldValue('phone', item.number);
                                                    setFilterSearch([])
                                                }}
                                            >
                                                <ListItem.Content>                              
                                                    <ListItem.Title>
                                                    <SearchHighlighter values={item.number} value={values.phone} />
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
                                        entity='phone'
                                    />
                                </View>

                                <Button
                                    title={pinScreen ? 'Purchase now' : 'Verify Transaction PIN'}
                                    onPress={() => setPinScreen(true) }
                                    disabled={!isValid}
                                    buttonStyle={styles.button}
                                    containerStyle={{ marginTop: 20 }}
                                />
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
