import { View, Text } from 'react-native'
import React from 'react'
import { Button, Input } from 'react-native-elements';
import { BASE_URL, Loader, ScrollViewHeader, styles } from '../components/global';
import { Formik } from 'formik';
import * as yup from "yup";
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';
import {axios as publicAxios} from 'axios';
import { closeAlert, showAlert } from 'react-native-customisable-alert';


export const VerifyOtpPassword = ({route, navigation}) => {
    const { email } = route.params;
    const formRef = React.useRef();

    const handleSendPin = () => {
        ;
        publicAxios.put(`${BASE_URL}api/resend-otp`, {email: email}).then((res) => {
            if ( res.data.status === 200 ) {
                showAlert({alertType: 'success' , title: 'Success', message:  res.data.message});
            } else {
                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
            }
        });
    }

    React.useEffect(() => {
        handleSendPin();
    }, [])

    return (
        <>
            <View style={styles.centerContainer}>
                <View style={{marginBottom: 30}}>
                    <ScrollViewHeader
                        image={dummies.images.icon}
                        title='Account password reset'
                    />
                </View>

                <Formik
                    innerRef={formRef}
                    initialValues={{
                        pin: ''
                    }}
                    validationSchema={yup.object().shape({
                        pin: yup
                            .string()
                            .required("Enter your the PIN sent to your email")
                            .min(5, "Min of 5 digits is required!")
                            .max(5, "Max of 5 digits is required!")
                    })}
                    validateOnChange={true}
                    validateOnMount={true}
                    onSubmit={(values) => {
                        publicAxios.put(`${BASE_URL}api/verify-registration-otp`, {otp: values.pin, email: email}).then((res) => {
                            if ( res.data.status === 200 ) {
                                showAlert({alertType: 'success' , title: 'Success', message:  res.data.message});                                
                                delay(() => {
                                    closeAlert();
                                    navigation.navigate('NewPassword', {otp: values.pin, email: email});
                                }, 2000);                      
                                    
                            } else {
                                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
                            }
                        });
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, errors, isValid, touched, values}) => (
                        <>
                            <View style={{flex: 10, width: '100%'}}>                           

                                <Input
                                    inputContainerStyle={styles.input}      
                                    placeholder="Enter PIN"
                                    onChangeText={handleChange('pin')}
                                    onBlur={handleBlur('pin')}
                                    label={`Enter the PIN sent to ${email} `}
                                    keyboardType='numeric'
                                    value={values.pin}
                                    errorMessage={errors.pin && touched.pin && errors.pin}
                                />
                                <Button type='clear' onPress={handleSendPin} title='Resend OTP' />
                            </View>

                            <View style={{flex: 1, width: '100%'}}>
                                <Button onPress={handleSubmit} disabled={!isValid} buttonStyle={styles.button} title='Verify PIN' />
                            </View>
                        </>
                    )}
                </Formik>
            </View>
        </>
    )
};