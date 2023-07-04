import { View } from 'react-native';
import React from 'react';
import { styles, theme, Loader, ScrollViewHeader, getData, storeData } from '../components/global';
import { Button, Input, Switch, Text, ButtonGroup, Overlay } from 'react-native-elements';
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';
import { Formik } from 'formik';
import * as yup from "yup";
import capitalize from "lodash/capitalize";
import { VerifyPin } from './verifyPin';
import axios from 'axios';
import { closeAlert } from 'react-native-customisable-alert';

export const BuyData = ({ route, navigation }) => {
    const { slug, api_product_id, image, amount, name } = route.params;
    const [value, setValue] = React.useState(false);
    const [pinScreen, setPinScreen] = React.useState(false);
    const formRef = React.useRef();

    const [userData, setUserData] = React.useState([]);
    React.useEffect(() => {
        getData('basicData').then(res => {
            setUserData(res);
        });
    }, []);

    return (
        <>
            <View style={styles.centerContainer}>
                <View style={{flex: 2}}>
                    <ScrollViewHeader
                        image={image}
                        title={`Purchase ${capitalize(name)}`}
                        subTitle={`Wallet Balance = ${userData.balance}`}
                    />
                </View>

                <View style={{flex: 4, width: '100%'}}>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            amount: amount,
                            phone: '',
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
                        onSubmit={(values, actions) => {                    
                            setPinScreen(false);
                            storeData('pinScreen', false);
                            axios.post(`buy-services.php&service=datashare`, values).then((res) => {
                                if (res.data.status === true) {
                                    showAlert({alertType: 'success' , title: 'Success', message: 'please wait to be directed to Dashboard'});

                                    delay(() => {
                                        closeAlert();
                                        navigation.navigate('Dashboard');
                                    }, 2000);
                                } else {
                                    showAlert({alertType: 'error' , title: 'Error', message: res.data.message + ' Try again later'});
                                }
                            }).then(() => {
                                actions.setSubmitting(false);
                            })
                        }}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            isValid,
                            errors,
                            touched,
                            values,
                        }) => (
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
                                    errorMessage={
                                        errors.phone &&
                                        touched.phone &&
                                        errors.phone
                                    }
                                />
                                
                                <ButtonGroup
                                    containerStyle={{height: 50, marginHorizontal: 0}} 
                                    buttons={['Select beneficiary', 'Select contact']} 
                                />

                                <View style={styles.rowFlex}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Save to beneficiary</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Switch color={theme.colors.primary} value={value} onValueChange={() => setValue(!value)} />
                                    </View>
                                </View>

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
                    </Formik>
                </View>
            </View>
            
            <VerifyPin 
                isVisible={pinScreen} 
                closePinScreen={() => setPinScreen(false)} 
                action={() =>  formRef.current.handleSubmit() } 
            />
        </>
    );
};
