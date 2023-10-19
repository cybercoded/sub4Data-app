import React from 'react';
import { View } from 'react-native';
import { Formik } from 'formik';
import { BASE_URL,ScrollViewHeader, styles } from '../components/global';
import { Button, Icon, Input, Text } from 'react-native-elements';
import * as yup from 'yup';
import delay from 'lodash/delay';
import { dummies } from '../components/dummies';
import axios, * as publicAxios from 'axios';
import { closeAlert, showAlert } from 'react-native-customisable-alert';

export const ForgetPassword = ({navigation}) => {  
    return(
        <View style={styles.centerContainer}>
            <View style={{flex: 1, width: '100%'}}>

                <View style={{marginBottom: 30}}>
                    <ScrollViewHeader
                        image={dummies.images.icon}
                        title='Account password reset'
                    />
                </View>

                <Formik
                    initialValues={{
                        email: ''
                    }}
                    validateOnChange={true}
                    validateOnMount={true}
                    validationSchema={ 
                        yup.object().shape({
                            email: yup.string().email('Invalid email').required('Enter your email address')
                        })
                    }
                    onSubmit={values => {
                        
                        publicAxios.get(`${BASE_URL}api/verify-user-email/${values.email}`).then((res) => {   
                            if ( res.data.status === 200) {
                                publicAxios.put(`${BASE_URL}api/resend-otp`, {email: values.email}).then((res) => {
                                    showAlert({alertType: 'success' , title: 'Success', message:  res.data.message});
                                    delay(() => {
                                        closeAlert();
                                        navigation.navigate('VerifyOtpPassword', {email: values.email})
                                    }, 1000);
                                });
                            }else {
                                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
                            }
                        }).catch( (error) => {
                            showAlert({alertType: 'error' , title: 'Error', message: error.message});
                        });
                    }}>
                    {({ handleChange, handleBlur, handleSubmit, isValid, errors, touched, values }) => (
                        <View>
                            <Input 
                                placeholder='Email address' 
                                inputContainerStyle={styles.input} 
                                containerStyle={{paddingHorizontal: 0}} 
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                label="Enter your registered email address"
                                errorMessage={errors.email && touched.email && errors.email}
                            />

                            <Button onPress={handleSubmit} disabled={!isValid} title='Reset my account password' buttonStyle={styles.button} containerStyle={{marginTop: 40}}/>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <View style={styles.rowFlex}>
                                    <Button type='clear' onPress={() => navigation.navigate('Signin') } title='Sign in' style={{marginLeft: 10}} />
                                </View>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        </View>
    );
};