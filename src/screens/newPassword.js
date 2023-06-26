import React from "react";
import { API, BASE_URL, Loader, styles } from "../components/global";
import { Context } from "../components/userContext";
import { delay } from "lodash";
import { View } from "react-native";
import { Formik } from "formik";
import { Text, Input, Button } from "react-native-elements";
import { dummies } from '../components/dummies';
import * as yup from "yup";
import axios from "axios";


export const NewPassword = ({route, navigation}) => {
    const { email, otp } = route.params;
    const { valueState, valueDispatch } = React.useContext(Context);
    const formRef = React.useRef();

    const [passwordState, setPasswordState] = React.useState();

    const handleChangePassword = () => {  
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });
        axios.put(`${BASE_URL}api/verify-otp-and-reset`, {password: passwordState.password2, email: email, otp: otp}).then((res) => {
            if (res.data.status === 200) {
                valueDispatch({ loader: { ...dummies.modalProcess.success, text: res.data.message+ ' Proceed to Login'}});
                delay(() => {                            
                    valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                    navigation.navigate('Signin');
                }, 1000)
            } else {
                valueDispatch({ loader: { ...dummies.modalProcess.error, text: res.data.errors}});   
            }
        });
    };

    const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

    return (
    <>
        <View style={styles.centerContainer}>
            <Formik
                innerRef={formRef}
                initialValues={{
                    password1: 'Tommy01',
                    password2: 'Tommy01'
                }}
                validateOnChange={true}
                validateOnMount={true}
                validationSchema={yup.object().shape({
                    password1: yup
                        .string()
                        .required("Enter your current password"),
                    password2: yup
                        .string()
                        .required("Enter your new password")
                        .oneOf([yup.ref('password1'), null], "Password does not match")
                        .matches(passwordRules, { message: "Min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit" })            
                })}
                onSubmit={(values) => {
                    setPasswordState(values);
                    valueDispatch({ loader: { ...dummies.modalProcess.warning } });
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, isValid, errors, touched, values}) => (
                    <>
                        <View style={{ flex: 8, width: "100%" }}>
                            <Input
                                placeholder="Enter your current password"
                                value={values.password1}
                                label="Current password"
                                onChangeText={handleChange("password1")}
                                onBlur={handleBlur("password1")}
                                inputContainerStyle={styles.input}
                                containerStyle={{ paddingHorizontal: 0 }}
                                errorMessage={
                                    errors.password1 &&
                                    touched.password1 &&
                                    errors.password1
                                }
                            />

                            <Input
                                placeholder="Enter your current password"
                                label="New password"
                                value={values.password2}
                                onChangeText={handleChange("password2")}
                                onBlur={handleBlur("password2")}
                                inputContainerStyle={styles.input}
                                containerStyle={{ paddingHorizontal: 0 }}
                                errorMessage={
                                    errors.password2 &&
                                    touched.password2 &&
                                    errors.password2
                                }
                            />
                            
                        </View>
                        <View style={{width: '100%'}}>
                            <Button onPress={handleSubmit} disabled={!isValid} title="Proceed" buttonStyle={styles.button} />
                        </View>
                        
                    </>
                )}
            </Formik>
            
        </View>
            <Loader
                handleWarning={() => handleChangePassword() }
                handleRetry={() =>  formRef.current.handleSubmit() }
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide}})}
                props={valueState.loader}
            />        
    </>
    );
};