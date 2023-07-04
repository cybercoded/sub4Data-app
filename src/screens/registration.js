import React from 'react';
import { Image, Modal, Pressable, View, SafeAreaView, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { ErrorResponse, Loader, ScrollViewHeader, storeData, styles, theme } from '../components/global';
import { Button, Icon, Input, Switch, Text } from 'react-native-elements';
import * as yup from 'yup';
import delay from 'lodash/delay';
import { dummies } from '../components/dummies';
import axios, {axios as publicAxios} from 'axios';
import { closeAlert, showAlert } from 'react-native-customisable-alert';


export const Registration = ({ navigation }) => {
    const [passwordVisibility, setPasswordVisibility] = React.useState(true);
    const [isReferred, setIsReferred] = React.useState(false);

    return (
        <>
            <View style={styles.centerContainer}>
                <ScrollViewHeader
                    image={dummies.images.icon}
                    title='Create free account on Sub4Data'
                />

                <View style={{ flex: 5 }}>
                    <ScrollView>
                        <Formik
                            initialValues={{
                               /*  name: 'Oluwadare Tomiwa Kunle',
                                email: 'cafeat9ja@gmail.coms',
                                password: 'password' */

                                name: "",
                                email: "",
                                password: ""
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
                                publicAxios.get('https://sub4data.com.ng/laravel/sanctum/csrf-cookie').then(() => {
                                    axios.post(`register`, values).then((res) => {
                                        if (res.data.status === 200) {
                                            storeData('auth_token', res.data.token);
                                            showAlert({alertType: 'success' , title: 'Success', message: res.data.message});
                                            axios.get(`user/`).then((res) => {
                                                if (res.data.status === true) {
                                                    valueDispatch({ basicData: res.data.data });
                                                    storeData('basicData', { ...res.data.data, isLoggedIn: true });

                                                    delay(() => {
                                                        closeAlert();
                                                        navigation.navigate('Home');
                                                    }, 1000);
                                                }
                                            });
                                        } else {
                                            showAlert({alertType: 'error' , title: 'Error', message: <ErrorResponse data={res.data.validation_errors} />});
                                        }
                                    });
                                });
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, errors, isValid, touched, values }) => (
                                <>
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
