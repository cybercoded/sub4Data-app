import { Formik } from "formik";
import React from "react";
import { API, BASE_URL, Loader, styles } from "../components/global";
import { Context } from "../components/userContext";
import { View } from "react-native";
import { Button, Input } from "react-native-elements";
import * as yup from "yup";
import { dummies } from "../components/dummies";
import axios from "axios";
import delay from "lodash/delay";

export const TransferFund = ({navigation}) => {
    const [submitState, setSubmitState] = React.useState();
    const { valueState, valueDispatch } = React.useContext(Context);
    const [transferReceiverId, setTransferReceiverId] = React.useState();
    const formRef = React.useRef();

    const handleTransferFund = () => {   
        valueDispatch({ loader: { ...dummies.modalProcess.loading}})
        API.put(`transfer-fund`, {...submitState, user_id: transferReceiverId}).then((res) => {
            if (res.data.status === 200) {
                valueDispatch({ loader: { ...dummies.modalProcess.success, text: res.data.message}});
                delay(() => {
                    valueDispatch({ loader: { ...dummies.modalProcess.hide}});
                    navigation.navigate('Home');
                }, 1000)
            } else {
                valueDispatch({ loader: { ...dummies.modalProcess.error, text: res.data.errors}});
            }
        }).catch((err) => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: err.message }});
        });
    };

    return (
        <>
            <View styles={styles.container}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            email: 'cafeat9ja@gmail.com',
                            amount: 100
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
                            setSubmitState(values);
                            valueDispatch({ loader: { ...dummies.modalProcess.loading}});
                            axios.get(`${BASE_URL}api/verify-user-email/${values.email}`).then((res) => { 
                                if (res.data.status === 200) {              
                                    valueDispatch({ loader: { ...dummies.modalProcess.warning } });
                                    setTransferReceiverId(res.data.data.user_id)
                                } else {
                                    valueDispatch({ loader: { ...dummies.modalProcess.error, text: res.data.errors }});
                                }
                            }).catch((err) => {
                                valueDispatch({ loader: { ...dummies.modalProcess.error, text: err.message }});
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

            <Loader
                handleWarning={() => handleTransferFund() }
                handleRetry={() =>  formRef.current.handleSubmit() }
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide}})}
                props={valueState.loader}
            />  
        </>
    );
}


export default TransferFund;