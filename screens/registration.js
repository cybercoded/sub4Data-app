import React from 'react';
import { Image, Modal, Pressable, View, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { API, Loader, storeData, styles, theme } from '../components/global';
import { Button, Icon, Input, Switch, Text } from 'react-native-elements';
import * as yup from 'yup';
import { Context } from '../components/userContext';
import delay from 'lodash/delay';
import { dummies } from '../components/dummies';

export const Registration = ({ navigation }) => {
    const { valueState, valueDispatch } = React.useContext(Context);

    const [passwordVisibility, setPasswordVisibility] = React.useState(true);
    const [isReferred, setIsReferred] = React.useState(false);

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, marginBottom: 20, alignItems: 'center' }}>
                <Image style={{ height: 80, width: 100 }} source={require('../assets/icon.png')} resizeMode="contain" />
                <Text style={{ marginVertical: 10 }}>Create free account on Tommytop</Text>
            </View>

            <View style={{ flex: 5 }}>
                <ScrollView>
                    <Formik
                        initialValues={{
                            fullNames: 'Oluwadare Tomiwa Kunle',
                            email: 'cafeat9ja@gmail.coms',
                            phoneNumber: '09036989565',
                            password: 'password',
                            referer: 'cafeat9ja@gmail.com'

                            /* fullNames: "",
                            email: "",
                            phoneNumber: "",
                            password: "",
                            referer: "", */
                        }}
                        validateOnChange={false}
                        validationSchema={yup.object().shape({
                            fullNames: yup
                                .string()
                                .required('Enter your full names')
                                .min(7, 'Min of 7 characters is required!')
                                .max(30, 'Max of 30 characters is required!'),
                            phoneNumber: yup
                                .string()
                                .required('Enter your phone number')
                                .min(11, 'Enter 11 digits fornat Nigerian phone number!')
                                .max(11, 'Enter 11 digits fornat Nigerian phone number!'),
                            email: yup
                                .string()
                                .email('Invalid email')
                                .required('Enter your email address')
                                .test(
                                    'Unique Email',
                                    'Email already in use', // <- key, message
                                    function (value) {
                                        return new Promise((resolve, reject) => {
                                            API.post(`check-email.php`, { email: value }).then((res) => {
                                                if (res.data === true) {
                                                    resolve(true);
                                                } else {
                                                    resolve(false);
                                                }
                                            });
                                        });
                                    }
                                ),
                            password: yup
                                .string()
                                .required('Enter your passsword')
                                .matches(
                                    /^[a-zA-Z0-9_+-]{5,15}$/,
                                    `Should be 5-15 characters, lowercase, uppercase or numbers and [_, -, +] characters`
                                ),
                            referer: yup
                                .string()
                                .email("Invalid referer' email")
                                .test(
                                    'Unique referer',
                                    'Referer not found', // <- key, message
                                    function (value) {
                                        return new Promise((resolve, reject) => {
                                            API.post(`check-email.php`, { email: value }).then((res) => {
                                                if (!isReferred) {
                                                    resolve(true);
                                                } else {
                                                    if (res.data === false) {
                                                        resolve(true);
                                                    } else {
                                                        resolve(false);
                                                    }
                                                }
                                            });
                                        });
                                    }
                                )
                        })}
                        onSubmit={(values) => {
                            valueDispatch({ loader: { ...dummies.modalProcess.loading } });
                            API.post(`register.php`, values)
                                .then((res) => {
                                    if (res.data.status === true) {
                                        valueDispatch({ loader: { ...dummies.modalProcess.success, text: res.data.message } });
                                        API.get(`getdata.php?userId=${res.data.userId}`).then((res) => {
                                            if (res.data.status === true) {
                                                valueDispatch({ basicData: res.data.data });
                                                storeData('basicData', { ...res.data.data, isLoggedIn: true });

                                                delay(() => {
                                                    valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                                                    navigation.navigate('Dashboard');
                                                }, 1000);
                                            }
                                        });
                                    } else {
                                        valueDispatch({ loader: { ...dummies.modalProcess.error, text: 'Something went wrong' } });
                                    }
                                })
                                .catch((err) => {
                                    valueDispatch({ loader: { ...dummies.modalProcess.error, text: err.message } });
                                    console.error(err.message);
                                });
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
                            <View>
                                <Loader
                                    submittion={handleSubmit}
                                    handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })}
                                    props={valueState.loader}
                                />
                                <View>
                                    <Input
                                        placeholder="Full names"
                                        inputContainerStyle={styles.input}
                                        containerStyle={{ paddingHorizontal: 0 }}
                                        onChangeText={handleChange('fullNames')}
                                        onBlur={handleBlur('fullNames')}
                                        value={values.fullNames}
                                        errorMessage={errors.fullNames && touched.fullNames && errors.fullNames}
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
                                        placeholder="Phone number"
                                        inputContainerStyle={styles.input}
                                        containerStyle={{ paddingHorizontal: 0 }}
                                        onChangeText={handleChange('phoneNumber')}
                                        onBlur={handleBlur('phoneNumber')}
                                        value={values.phoneNumber}
                                        errorMessage={errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}
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

                                <View style={styles.rowFlex}>
                                    <Text
                                        style={{
                                            color: theme.colors.primary
                                        }}
                                    >
                                        I was {isReferred && 'not'} referred
                                    </Text>
                                    <Switch
                                        color={theme.colors.primary}
                                        value={isReferred}
                                        onValueChange={() => setIsReferred(!isReferred)}
                                    />
                                </View>

                                {isReferred && (
                                    <View style={{ marginTop: 15 }}>
                                        <Input
                                            placeholder="Enter the email of who referred you"
                                            inputContainerStyle={styles.input}
                                            containerStyle={{ paddingHorizontal: 0 }}
                                            onChangeText={handleChange('referer')}
                                            onBlur={handleBlur('referer')}
                                            value={values.referer}
                                            placeholderTextColor={theme.colors.primary}
                                            errorMessage={errors.referer && touched.referer && errors.referer}
                                        />
                                    </View>
                                )}

                                <View style={{ marginVertical: 10 }}>
                                    <Text style={{ textAlign: 'center' }}>
                                        By continuing it means you accept all our terms and conditions.
                                    </Text>
                                </View>

                                <Button onPress={handleSubmit} title="Create free account" buttonStyle={styles.button} />

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
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </View>
        </View>
    );
};
