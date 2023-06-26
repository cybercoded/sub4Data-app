import React from 'react';
import { Image, Modal, Pressable, View, SafeAreaView, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { API, ErrorResponse, Loader, ScrollViewHeader, storeData, styles, theme } from '../components/global';
import { Button, Icon, Input, Switch, Text } from 'react-native-elements';
import * as yup from 'yup';
import { Context } from '../components/userContext';
import delay from 'lodash/delay';
import { dummies } from '../components/dummies';
import axios from 'axios';

export const Registration = ({ navigation }) => {
    const { valueState, valueDispatch } = React.useContext(Context);
    const [passwordVisibility, setPasswordVisibility] = React.useState(true);
    const [isReferred, setIsReferred] = React.useState(false);

    return (
        <>
            <View style={styles.container}>
                <ScrollViewHeader
                    image={dummies.images.icon}
                    title='Create free account on Tommytop'
                />

                <View style={{ flex: 5 }}>
                    <ScrollView>
                        <Formik
                            initialValues={{
                                name: 'Oluwadare Tomiwa Kunle',
                                email: 'cafeat9ja@gmail.coms',
                                password: 'password'

                                /* fullNames: "",
                                email: "",
                                phoneNumber: "",
                                password: "",
                                referer: "", */
                            }}
                            validateOnChange={true}
                            validationSchema={yup.object().shape({
                                name: yup
                                    .string()
                                    .required('Enter your full names')
                                    .min(7, 'Min of 7 characters is required!')
                                    .max(30, 'Max of 30 characters is required!'),
                                email: yup
                                    .string()
                                    .email('Invalid email')
                                    .required('Enter your email address'),
                                password: yup
                                    .string()
                                    .required('Enter your password')
                                    .matches(
                                        /^[a-zA-Z0-9_+-]{5,15}$/,
                                        `Should be 5-15 characters, lowercase, uppercase or numbers and [_, -, +] characters`
                                    )
                            })}
                            onSubmit={(values) => {
                                valueDispatch({ loader: { ...dummies.modalProcess.loading } });
                                axios.get('https://sub4data.com.ng/laravel/sanctum/csrf-cookie').then(() => {
                                    API.post(`register`, values)
                                    .then((res) => {
                                        if (res.data.status === 200) {
                                            storeData('auth_token', res.data.token);
                                            valueDispatch({ loader: { ...dummies.modalProcess.success, text: res.data.message } });
                                            API.get(`user/`).then((res) => {
                                                if (res.data.status === true) {
                                                    valueDispatch({ basicData: res.data.data });
                                                    storeData('basicData', { ...res.data.data, isLoggedIn: true });

                                                    delay(() => {
                                                        valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                                                        navigation.navigate('Home');
                                                    }, 1000);
                                                }
                                            });
                                        } else {
                                            valueDispatch({ loader: { ...dummies.modalProcess.error, text: <ErrorResponse data={res.data.validation_errors} />} });
                                        }
                                    })
                                    .catch((err) => {
                                        valueDispatch({ loader: { ...dummies.modalProcess.error, text: err.message } });
                                        console.error(err.message);
                                    });
                                });
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, errors, isValid, touched, values }) => (
                                <>
                                    <Loader
                                        handleRetry={handleSubmit}
                                        handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })}
                                        props={valueState.loader}
                                    />
                                    <View>
                                        <Input
                                            placeholder="Full names"
                                            inputContainerStyle={styles.input}
                                            containerStyle={{ paddingHorizontal: 0 }}
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                            value={values.name}
                                            errorMessage={errors.name && touched.name && errors.name}
                                        />
                                        <Input
                                            placeholder="Email address"
                                            inputContainerStyle={styles.input}
                                            containerStyle={{ paddingHorizontal: 0 }}
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                            errorMessage={errors.email && touched.email && errors.email}
                                        />

                                        <Input
                                            placeholder="Password"
                                            inputContainerStyle={styles.input}
                                            containerStyle={{ paddingHorizontal: 0 }}
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                            secureTextEntry={passwordVisibility}
                                            rightIcon={
                                                <Icon
                                                    name={passwordVisibility ? 'visibility' : 'visibility-off'}
                                                    size={35}
                                                    color={theme.colors.gray}
                                                    onPress={() => setPasswordVisibility(!passwordVisibility)}
                                                />
                                            }
                                            errorMessage={errors.password && touched.password && errors.password}
                                        />
                                    </View>

                                    <View style={{ marginVertical: 10 }}>
                                        <Text style={{ textAlign: 'center' }}>
                                            By continuing it means you accept all our terms and conditions.
                                        </Text>
                                    </View>

                                    <Button onPress={handleSubmit} disabled={!isValid} title="Create free account" buttonStyle={styles.button} />

                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <View style={styles.rowFlex}>
                                            <Text>already have an account?</Text>
                                            <Pressable onPress={() => navigation.navigate('Signin')} style={{ marginLeft: 10 }}>
                                                <Text
                                                    style={{
                                                        color: theme.colors.primary
                                                    }}
                                                >
                                                    Sign in
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </ScrollView>
                </View>
            </View>
        </>
    );
};
