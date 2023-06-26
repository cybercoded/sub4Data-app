import { View, Text } from 'react-native'
import React from 'react'
import { Button, Icon, Input } from 'react-native-elements';
import { API, Loader, storeData, styles, theme } from '../components/global';
import { Formik } from 'formik';
import * as yup from "yup";
import { Context } from '../components/userContext';
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';

export const VerifyOtpPIn = ({navigation}) => {
    const formRef = React.useRef();
    const {valueState, valueDispatch} = React.useContext(Context);

    const handleSendPin = () => {
        valueDispatch({loader: {...dummies.modalProcess.loading}});
        API.get(`reset-pin`).then((res) => {
            if ( res.data.status === 200 ) {
                valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message}});
                delay(() => {
                    valueDispatch({loader: {...dummies.modalProcess.hide}});
                }, 1000)
                
            } else {
                valueDispatch({loader: {...dummies.modalProcess.error, text: res.data.errors}});
            }
        })
        .catch((err) => {
            valueDispatch({loader: {...dummies.modalProcess.error, text: err.message}});
            console.error(err.message);
        });
    }
    
    React.useEffect(() => {
        handleSendPin();
    }, [])

    return (
        <>
            <View style={styles.centerContainer}>
                <Formik
                    innerRef={formRef}
                    initialValues={{
                        pin: ''
                    }}
                    validationSchema={yup.object().shape({
                        pin: yup
                            .string()
                            .required("Enter your the PIN sent to your email")
                            .min(5, "Min of 5 digits is required!")
                            .max(5, "Max of 5 digits is required!")
                    })}

                    onSubmit={(values) => {
                        valueDispatch({loader: {...dummies.modalProcess.loading}});
                        API.put(`reset-pin`).then((res) => {
                            if ( res.data.status === 200 ) {
                                valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message+', please wait to be refreshed'}});
                                API.get(`get-user`).then((res) => {
                                    if ( res.data.status === 200) {                                       
                                        storeData('basicData', {...res.data.data});
                                        valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message}});                                
                                        delay(() => {
                                            valueDispatch({loader: {...dummies.modalProcess.hide}});
                                            navigation.navigate('Home');
                                        }, 2000);                                
                                    }
                                });
                            } else {
                                valueDispatch({loader: {...dummies.modalProcess.error, text: res.data.errors}});
                            }
                        })
                        .catch((err) => {
                            valueDispatch({loader: {...dummies.modalProcess.error, text: err.message}});
                            console.error(err.message);
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
                                    label={`Enter the PIN sent to ${valueState.basicData?.email} `}
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
            <Loader
                handleRetry={() => formRef.current.handleSubmit()}
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } }) }
                props={valueState.loader}
            />
        </>
    )
};