import React from 'react';
import {  Pressable, View } from 'react-native';
import { Formik } from 'formik';
import { API_URL, BASE_URL, ScrollViewHeader, storeData, styles, theme } from '../components/global';
import { Button, Icon, Input, Text } from 'react-native-elements';
import * as yup from 'yup';
import { delay, isObject } from 'lodash';
import { dummies } from '../components/dummies';
import axios, * as publicAxios from 'axios';
import { closeAlert, showAlert } from 'react-native-customisable-alert';


export const Signin = ({navigation}) => {

    const [passwordVisibility, setPasswordVisibility] = React.useState(true);

    return(
        <View style={styles.centerContainer}>
            <View style={{flex: 1, width: '100%'}}>
                <View style={{marginBottom: 30}}>
                    <ScrollViewHeader
                        image={dummies.images.icon}
                        title='Sign in to your sub4Data account'
                    />
                </View>

                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    validateOnMount={true}
                    validationSchema={ 
                        yup.object().shape({
                            email: yup.string().email('Invalid email').required('Enter your email address'),
                            password: yup.string().required('Enter your password').matches(/^[a-zA-Z0-9_-]{5,15}$/, 'Should be 5-15 characters, lowercase, uppercase or numbers')
                        })
                    }
                    onSubmit={values => {                        
                        publicAxios.post(`${BASE_URL}api/login`, values).then((res) => {   
                            if ( res.data.status === 200) { 
                                showAlert({alertType: 'success' , title: 'Success', message:  'Login Successful, please wait to be redirected to dashboard'})
                                storeData('auth_token', res.data.token);
                                axios.get(`get-user`).then((res) => {
                                    if ( isObject(res.data.data) && res.data.status === 200) {                                       
                                        storeData('basicData', {...res.data.data, isLoggedIn: true});
                                        
                                        delay(() => {
                                            closeAlert();
                                            navigation.navigate('Home')
                                        }, 2000);                                        
                                    }
                                });
                            }else {
                                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
                            }
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
                            errorMessage={errors.email && touched.email && errors.email}
                        />
                        <Input 
                            placeholder='Password' 
                            inputContainerStyle={styles.input} 
                            containerStyle={{paddingHorizontal: 0}} 
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={passwordVisibility}
                            rightIcon={<Icon name={passwordVisibility ? 'visibility' : 'visibility-off'} size={35} color={theme.colors.gray} onPress={() => setPasswordVisibility(!passwordVisibility) } />}
                            errorMessage={errors.password && touched.password && errors.password}
                        />
                        
                        <Pressable onPress={() => navigation.navigate('ForgetPassword') } style={{marginLeft: 10, flex: 1, alignItems: 'center'}} >
                            <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>Forget password?</Text>
                        </Pressable>


                        <Button onPress={handleSubmit} disabled={!isValid} title='Sign in to your account' buttonStyle={styles.button} containerStyle={{marginTop: 40}}/>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <View style={styles.rowFlex}>
                                <Text>Don't have an account?</Text>
                                <Pressable onPress={() => navigation.navigate('Registration') } style={{marginLeft: 10}} ><Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>Sign up</Text></Pressable>
                            </View>
                        </View>
                    </View>
                    )}
                </Formik>
            </View>
        </View>
    );
};