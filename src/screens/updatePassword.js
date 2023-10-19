import React from "react";
import { styles } from "../components/global";
import { delay } from "lodash";
import { View } from "react-native";
import { Formik } from "formik";
import { Text, Input, Button } from "react-native-elements";
import { dummies } from '../components/dummies';
import * as yup from "yup";
import { closeAlert, showAlert } from 'react-native-customisable-alert';
import axios from "axios";

export const UpdatePassword = ({navigation}) => {

      const formRef = React.useRef();

    const [passwordState, setPasswordState] = React.useState();

    const handleChangePassword = (values) => {  
        closeAlert();
        axios.put(`update-password`, {password: values.newPassword}).then((res) => {
            if (res.data.status === 200) {
                showAlert({alertType: 'success' , title: 'Success', message: res.data.message});
                delay(() => { 
                    closeAlert();                           
                    navigation.navigate('Home');
                }, 1000)
            } else {
                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});   
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
                    oldPassword: '',
                    newPassword: ''
                }}
                validateOnChange={true}
                validateOnMount={true}
                validationSchema={yup.object().shape({
                    oldPassword: yup
                        .string()
                        .required("Enter your current password"),
                    newPassword: yup
                        .string()
                        .required("Enter your new password")
                        .notOneOf([yup.ref('oldPassword'), null], "Enter different password from the current password")
                        .matches(passwordRules, { message: "Min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit" })            
                })}
                onSubmit={(values) => {
                    axios.get(`verify-password/${values.oldPassword}`).then((res) => {
                        if (res.data.status === 200) {
                            showAlert({
                                alertType: 'warning' , 
                                title: 'Are you sure?', 
                                message: 'Your password will be updated', 
                                onPress: () => handleChangePassword({...values})
                            });
                        } else {
                            showAlert({alertType: 'error' , title: 'Error', message: 'Incorrect Old Password, try again'});   
                        }
                    });
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, errors, touched, values}) => (
                    <>
                        <View style={{ flex: 8, width: "100%" }}>
                            <Input
                                placeholder="Enter your current password"
                                value={values.oldPassword}
                                label="Current password"
                                onChangeText={handleChange("oldPassword")}
                                onBlur={handleBlur("oldPassword")}
                                inputContainerStyle={styles.input}
                                containerStyle={{ paddingHorizontal: 0 }}
                                errorMessage={
                                    errors.oldPassword &&
                                    touched.oldPassword &&
                                    errors.oldPassword
                                }
                            />

                            <Input
                                placeholder="Enter your current password"
                                label="New password"
                                value={values.newPassword}
                                onChangeText={handleChange("newPassword")}
                                onBlur={handleBlur("newPassword")}
                                inputContainerStyle={styles.input}
                                containerStyle={{ paddingHorizontal: 0 }}
                                errorMessage={
                                    errors.newPassword &&
                                    touched.newPassword &&
                                    errors.newPassword
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
    </>
    );
};