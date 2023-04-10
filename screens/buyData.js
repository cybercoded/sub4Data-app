import { View, Image, Button as MyButton, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import React from 'react';
import { API, BASE_URL, styles, theme, Loader, PinVerifyPad, ScrollViewHeader } from '../components/global';
import { Button, Input, Switch, BottomSheet, Text, ButtonGroup } from 'react-native-elements';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import delay from 'lodash/delay';
import { Formik } from 'formik';
import * as yup from "yup";


export const BuyData = ({ route, navigation }) => {
    const { network, isPinVerified, product_code, description, amount } = route.params;
    const [value, setValue] = React.useState(false);
    const { valueState, valueDispatch } = React.useContext(Context);

    const formRef = React.useRef();

    React.useEffect(() => {
        
        if( isPinVerified && formRef.current) {
            formRef.current.handleSubmit()
        }

    }, []);

    return (
        <>
            <View style={styles.container}>
                <View style={{flex: 2}}>
                    <ScrollViewHeader
                        image={dummies.images.networks[network]}
                        title={`Purchase ${network.toUpperCase()} Data`}
                        subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
                    />
                </View>

                <View style={{flex: 4}}>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            amount: amount,
                            phone: valueState.basicData.tel,
                            product_code: product_code,
                        }}
                        validateOnChange={true}
                        validationSchema={yup.object().shape({
                        phone: yup
                            .string()
                            .required("Enter your phone number")
                            .min(11, "Enter 11 digits fornat Nigerian phone number!")
                            .max(11, "Enter 11 digits fornat Nigerian phone number!"),
                        amount: yup.string().required("Amount is required"),
                        })}
                        onSubmit={(values, actions) => {                    
                            valueDispatch({ loader: { ...dummies.modalProcess.loading} });
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
                            errors,
                            touched,
                            values,
                        }) => (
                            <>
                                <Input
                                    disabled={true}
                                    value={description}
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
                                    title="Proceed"
                                    onPress={() => navigation.navigate('VerifyPin', {landingPage: 'BuyData'})}
                                    buttonStyle={styles.button}
                                    disabled={isSubmitting}
                                />
                            </>
                        )}
                    </Formik>
                </View>
            </View>
            <Loader
                submittion={() =>  formRef.current.handleSubmit() }
                handler={() => valueDispatch({loader: {...dummies.modalProcess.hide}})}
                props={valueState.loader}
            />
        </>
    );
};
