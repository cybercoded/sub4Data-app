import React from 'react';
import { Image, Modal, Pressable, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import { API, API_URL, BASE_URL, errorHandler, getData, Loader, ScrollViewHeader, storeData, styles, theme } from '../components/global';
import { Button, Icon, Input, Text } from 'react-native-elements';
import * as yup from 'yup';
import { delay, isObject } from 'lodash';
import { dummies } from '../components/dummies';
import axios from 'axios';
import { Context, initialValues as loaderValues } from '../components/userContext';

export const ForgetPassword = ({navigation}) => {

    const { valueState, valueDispatch } = React.useContext(Context);

    return(
        <View style={styles.container}>
            <View style={{flex: 1, width: '100%'}}>

                <View style={{marginBottom: 30}}>
                    <ScrollViewHeader
                        image={dummies.images.icon}
                        title='Account password reset'
                    />
                </View>

                <Formik
                    initialValues={{
                        email: 'cafeat9ja@gmail.coms'
                    }}
                    validateOnChange={true}
                    validateOnMount={true}
                    validationSchema={ 
                        yup.object().shape({
                            email: yup.string().email('Invalid email').required('Enter your email address')
                        })
                    }
                    onSubmit={values => {
                        valueDispatch({loader: {...dummies.modalProcess.loading}})
                        axios.get(`${BASE_URL}api/verify-user-email/${values.email}`).then((res) => {   
                            if ( res.data.status === 200) {
                                axios.put(`${BASE_URL}api/resend-otp`, {email: values.email}).then((res) => {
                                    valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message}})
                                    delay(() => {
                                        navigation.navigate('VerifyOtpPassword', {email: values.email})
                                        valueDispatch({loader: {...dummies.modalProcess.hide}})
                                    }, 1000);
                                });
                            }else {
                                valueDispatch({loader: {...dummies.modalProcess.error, text: res.data.errors}});
                            }
                        }).catch( (error) => {
                            valueDispatch({loader: {...dummies.modalProcess.error, text: error.message}});
                        });
                    }}>
                    {({ handleChange, handleBlur, handleSubmit, isValid, errors, touched, values }) => (
                        <View>
                            <Loader
                                handleRetry={handleSubmit}
                                handler={() => valueDispatch({loader: {...valueState.loader, visible: false}})}
                                props={valueState.loader}
                            /> 
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