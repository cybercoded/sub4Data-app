import { View, Text } from 'react-native'
import React from 'react'
import { Button, Icon, Input } from 'react-native-elements';
import { API, BASE_URL, Loader, ScrollViewHeader, storeData, styles, theme } from '../components/global';
import { Formik } from 'formik';
import * as yup from "yup";
import { Context } from '../components/userContext';
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';
import axios from 'axios';

export const VerifyOtpPassword = ({route, navigation}) => {
    const { email } = route.params;
    const formRef = React.useRef();
    const {valueState, valueDispatch} = React.useContext(Context);

    const handleSendPin = () => {
        valueDispatch({loader: {...dummies.modalProcess.loading}});
        axios.put(`${BASE_URL}api/resend-otp`, {email: email}).then((res) => {
            if ( res.data.status === 200 ) {
                valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message}});
                delay(() => {
                    valueDispatch({loader: {...dummies.modalProcess.hide}});
                }, 1000)
            } else {
                valueDispatch({loader: {...dummies.modalProcess.error, text: res.data.errors}});
            }
        })
        .catch((err) => {
            valueDispatch({loader: {...dummies.modalProcess.error, text: err.message}});
            console.error(err.message);
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
                        valueDispatch({loader: {...dummies.modalProcess.loading}});
                        axios.put(`${BASE_URL}api/verify-registration-otp`, {otp: values.pin, email: email}).then((res) => {
                            if ( res.data.status === 200 ) {
                                valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message}});                                
                                delay(() => {
                                    valueDispatch({loader: {...dummies.modalProcess.hide}});
                                    navigation.navigate('NewPassword', {otp: values.pin, email: email});
                                }, 2000);                      
                                    
                            } else {
                                valueDispatch({loader: {...dummies.modalProcess.error, text: res.data.errors}});
                            }
                        })
                        .catch((err) => {
                            valueDispatch({loader: {...dummies.modalProcess.error, text: err.message}});
                            console.error(err.message);
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
            <Loader
                handleRetry={() => formRef.current.handleSubmit()}
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } }) }
                props={valueState.loader}
            />
        </>
    )
};