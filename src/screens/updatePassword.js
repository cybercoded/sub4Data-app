import React from "react";
import { API, Loader, styles } from "../components/global";
import { Context } from "../components/userContext";
import { delay } from "lodash";
import { View } from "react-native";
import { Formik } from "formik";
import { Text, Input, Button } from "react-native-elements";
import { dummies } from '../components/dummies';
import * as yup from "yup";


export const UpdatePassword = ({navigation}) => {

    const { valueState, valueDispatch } = React.useContext(Context);
    const formRef = React.useRef();

    const [passwordState, setPasswordState] = React.useState();

    const handleChangePassword = () => {  
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });
        API.put(`update-password`, {password: passwordState.newPassword}).then((res) => {
            if (res.data.status === 200) {
                valueDispatch({ loader: { ...dummies.modalProcess.success, text: res.data.message}});
                delay(() => {                            
                    valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                    navigation.navigate('Home');
                }, 1000)
            } else {
                valueDispatch({ loader: { ...dummies.modalProcess.error, text: res.data.errors}});   
            }
        }).catch((err) => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: err.message }});
        });
    };

    const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

    return (
    <>
        <View style={styles.centerContainer}>
            <Formik
                innerRef={formRef}
                initialValues={{
                    oldPassword: 'tommy',
                    newPassword: 'Tommy01'
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
                    valueDispatch({ loader: { ...dummies.modalProcess.loading } });
                    API.get(`verify-password/${values.oldPassword}`).then((res) => {
                        if (res.data.status === 200) {
                            valueDispatch({ loader: { ...dummies.modalProcess.warning }});
                            setPasswordState(values);
                        } else {
                            valueDispatch({ loader: { ...dummies.modalProcess.error, text: 'Incorrect Old Password, try again'}});   
                        }
                    }).catch((err) => {
                        valueDispatch({ loader: { ...dummies.modalProcess.error, text: err.message}});
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
            <Loader
                handleWarning={() => handleChangePassword() }
                handleRetry={() =>  formRef.current.handleSubmit() }
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide}})}
                props={valueState.loader}
            />        
    </>
    );
};