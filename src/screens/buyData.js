import { View, Image, Button as MyButton, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import React from 'react';
import { API, BASE_URL, styles, theme, Loader, PinVerifyPad, ScrollViewHeader, getData, storeData } from '../components/global';
import { Button, Input, Switch, BottomSheet, Text, ButtonGroup, Overlay } from 'react-native-elements';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import delay from 'lodash/delay';
import { Formik } from 'formik';
import * as yup from "yup";
import upperFirst from "lodash/upperFirst"
import capitalize from "lodash/capitalize";
import { VerifyPin } from './verifyPin';

export const BuyData = ({ route, navigation }) => {
    const { slug, api_product_id, image, amount, name } = route.params;
    const [value, setValue] = React.useState(false);
    const { valueState, valueDispatch } = React.useContext(Context);
    const [pinScreen, setPinScreen] = React.useState(false);
    const formRef = React.useRef();

    return (
        <>
            <View style={styles.container}>
                <View style={{flex: 2}}>
                    <ScrollViewHeader
                        image={image}
                        title={`Purchase ${capitalize(name)}`}
                        subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
                    />
                </View>

                <View style={{flex: 4, width: '100%'}}>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            amount: amount,
                            phone: '09036989565',
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
                            valueDispatch({ loader: { ...dummies.modalProcess.loading} });
                            setPinScreen(false);
                            storeData('pinScreen', false);
                            API.post(`buy-services.php?userId=${valueState.basicData.userId}&service=datashare`, values).then((res) => {
                                if (res.data.status === true) {
                                    valueDispatch({
                                        loader: { ...dummies.modalProcess.success,
                                            title: res.data.message,
                                            text: 'please wait to be directed to Dashboard'
                                        }
                                    });

                                    delay(() => {
                                        valueDispatch({loader: {...dummies.modalProcess.hide}});
                                        navigation.navigate('Dashboard');
                                    }, 2000);
                                } else {
                                    valueDispatch({loader: {
                                            ...dummies.modalProcess.error,
                                            text: res.data.message + ' Try again later'
                                        }
                                    });
                                }
                            }).catch((error) => {
                                valueDispatch({loader: {
                                    ...dummies.modalProcess.error,
                                    text: error.message
                                }})
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
            <Loader
                handleRetry={() =>  formRef.current.handleSubmit() }
                handler={() => valueDispatch({loader: {...dummies.modalProcess.hide}})}
                props={valueState.loader}
            />
            
            <VerifyPin 
                isVisible={pinScreen} 
                closePinScreen={() => setPinScreen(false)} 
                action={() =>  formRef.current.handleSubmit() } 
            />
        </>
    );
};
