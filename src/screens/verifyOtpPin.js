import { View } from 'react-native'
import React from 'react'
import { Button, Input } from 'react-native-elements';
import { styles, getData } from '../components/global';
import { Formik } from 'formik';
import * as yup from "yup";
import delay from 'lodash/delay';
import { closeAlert, showAlert } from 'react-native-customisable-alert';
import axios from "axios";

export const VerifyOtpPIn = ({navigation}) => {
    const formRef = React.useRef();
    const [userData, setUserData] = React.useState([]);

    const handleSendPin = () => {
        axios.get(`reset-pin`).then((res) => {
            if ( res.data.status === 200 ) {
                showAlert({alertType: 'success' , title: 'Success', message:  res.data.message});
                delay(() => {
                    closeAlert();
                }, 1000)
                
            } else {
                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
            }
        });
    }
    
    React.useEffect(() => {
        handleSendPin();

        getData('basicData').then(res => {
            setUserData(res);
        });
    }, [])

    return (
        <>
            <View style={styles.centerContainer}>
                <Formik
                    innerRef={formRef}
                    initialValues={{
                        pin: ''
                    }}
                    validateOnChange={true}
                    validateOnMount={true}
                    validationSchema={yup.object().shape({
                        pin: yup
                            .string()
                            .required("Enter your the PIN sent to your email")
                            .min(5, "Min of 5 digits is required!")
                            .max(5, "Max of 5 digits is required!")
                    })}

                    onSubmit={(values) => {
                        axios.get(`verify-otp-for-pin/${values.pin}`).then((res) => {
                            if ( res.data.status === 200 ) {                               
                                showAlert({alertType: 'success' , title: 'Success', message:  res.data.message});                                
                                delay(() => {
                                    closeAlert();
                                    navigation.navigate('CreatePin');
                                }, 1000);                   
                                    
                            } else {
                                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
                            }
                        });
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, errors, isValid, touched, values}) => (
                        <>
                            <View style={{flex: 10, width: '100%'}}>                           

                                <Input
                                    inputContainerStyle={styles.input}      
                                    placeholder="Enter PIN"
                                    onChangeText={handleChange('pin')}
                                    onBlur={handleBlur('pin')}
                                    label={`Enter the PIN sent to ${userData.email} `}
                                    keyboardType='numeric'
                                    value={values.pin}
                                />
                                <Button type='clear' onPress={handleSendPin} title='Resend OTP' />
                            </View>

                            <View style={{flex: 1, width: '100%'}}>
                                <Button onPress={handleSubmit} disabled={!isValid} buttonStyle={styles.button} title='Verify PIN' />
                            </View>
                        </>
                    )}
                </Formik>
            </View>
        </>
    )
};