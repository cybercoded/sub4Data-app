import { Formik } from "formik";
import React from "react";
import { BASE_URL, styles } from "../components/global";
import { View } from "react-native";
import { Button, Input } from "react-native-elements";
import * as yup from "yup";
import axios, * as publicAxios from 'axios';
import delay from "lodash/delay";
import { closeAlert, showAlert } from "react-native-customisable-alert";

export const TransferFund = ({navigation}) => {
    const formRef = React.useRef();

    const handleTransferFund = (values) => { 
        closeAlert(); 
        axios.put(`transfer-fund`, values).then((res) => {
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

    return (
        <>
            <View styles={styles.centerContainer}>
                <View style={{flex: 10, alignItems: 'center'}}>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            email: '',
                            amount: ''
                        }}
                        validateOnChange={true}
                        validateOnMount={true}
                        validationSchema={yup.object().shape({
                            email: yup
                                .string()
                                .email("Enter valid email"),
                            amount: yup
                                .number()
                                .required("Enter amount")
                                .min(50, "Minimum amount of N50 is required")
                                .max(5000, "Maximum amount of N5,000 is required")
                        })}
                        onSubmit={(values) => {
                            publicAxios.get(`${BASE_URL}api/verify-user-email/${values.email}`).then((res) => { 
                                if (res.data.status === 200) {              
                                    showAlert({
                                        alertType: 'warning', 
                                        title: 'Are you sure?', 
                                        message: `${values.amount} will be transferred to ${res.data.data.name}`, 
                                        onPress: () => handleTransferFund({...values, user_id: res.data.data.user_id})
                                    });
                                    
                                } else {
                                    showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});   
                                }
                            });
                        }}
                    >

                        {({ handleChange, handleBlur, handleSubmit, isValid, errors, touched, values}) => (
                            <>
                                <View style={{width: '90%', marginTop: 20}}>
                                    <Input
                                        placeholder="Email address"
                                        inputContainerStyle={styles.input}
                                        label="Email address of the receiver"
                                        containerStyle={{ paddingHorizontal: 0 }}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        errorMessage={errors.email && touched.email && errors.email}
                                    />

                                    <Input
                                        placeholder="Amount"
                                        value={values.amount}
                                        label="Amount to send"
                                        onChangeText={handleChange('amount')}
                                        keyboardType='numeric'
                                        onKeyPress={handleBlur("amount")}
                                        inputContainerStyle={styles.input}
                                        containerStyle={{ paddingHorizontal: 0 }}
                                        errorMessage={
                                            errors.amount 
                                            && touched.amount 
                                            && errors.amount
                                        }
                                    />
                                    
                                    <Button onPress={handleSubmit} disabled={!isValid} title="Proceed" containerStyle={{marginTop: 50}} buttonStyle={styles.button} />
                                </View>
                            </>
                        )}
                    </Formik>
                </View>
            </View>
        </>
    );
}


export default TransferFund;