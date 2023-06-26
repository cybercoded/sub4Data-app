import { View } from 'react-native';
import React from 'react';
import { API, Loader, ScrollViewHeader, styles } from '../components/global';
import { Button, Input } from 'react-native-elements';
import { Context } from '../components/userContext';
import { Formik } from 'formik';
import { dummies } from '../components/dummies';
import * as yup from 'yup';
import startCase from "lodash/startCase";
import { VerifyPin } from './verifyPin';

export const BuyBill = ({ route, navigation }) => {
    const { id, name, image, amount } = route.params;
    const { valueState, valueDispatch } = React.useContext(Context);
    const formRef = React.useRef();
    const [pinScreen, setPinScreen] = React.useState(false);
    const [customerName, setCustomerName] = React.useState('');

    const handleVerifyPin = (smartcard_number, service_id) => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });
        API.post(`smartcard-verification`, {smartcard_number: smartcard_number, service_id: service_id}).then((res) => {
            if (res.data.status === 200) {
                setCustomerName(res.data.name);
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
            } else {
                valueDispatch({
                    loader: {
                        ...dummies.modalProcess.error,
                        title: res.data.errors,
                        text: 'please try again!'
                    }
                });
            }
        })
        .catch((error) => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: error.errors } });
            console.error(error.message);
        });
    };

    return (
        <>
            <View style={styles.container}>
                <View style={{ flex: 2 }}>
                    <ScrollViewHeader
                        image={{ uri: image }}
                        title={startCase(name)}
                        subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
                    />
                </View>
                <View style={{ flex: 4, width: '100%' }}>
                    <Formik
                        innerRef={formRef}
                        validateOnChange={true}
                        initialValues={{
                            smartcard_number: '7023687567',
                            service_id: id,
                            amount: amount
                        }}
                        validateOnMount={true}
                        validationSchema={yup.object().shape({
                            smartcard_number: yup
                                .string()
                                .label('Card number')
                                .typeError('Must be only digits')
                                .required('Enter your your card number')
                                .min(10, 'Enter 10 digits!')
                                .max(10, 'Enter 10 digits!')
                        })}
                        onSubmit={(values) => {
                           alert()
                        }}
                    >
                        {({ handleSubmit, handleChange, handleBlur, isValid, errors, touched, setFieldValue, values }) => (
                            <>
                                <Input
                                    placeholder="Meter number"
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    value={values.smartcard_number}
                                    onChangeText={handleChange('smartcard_number')}
                                    onBlur={handleBlur('smartcard_number')}
                                    keyboardType='number-pad'
                                    errorMessage={errors.smartcard_number && touched.smartcard_number && errors.smartcard_number}
                                />

                                <Input
                                    placeholder="Amount to purchase"
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    value={values.amount}
                                    disabled={true}
                                />

                                { customerName == '' ? (
                                    <Button
                                        title="Verify my meter number"
                                        onPress={() => handleVerifyPin(values.smartcard_number, values.service_id)}
                                        buttonStyle={styles.button}
                                        containerStyle={{ marginTop: 20 }}
                                        disabled={!isValid}
                                    />
                                    ) : (
                                    <>
                                        <Input
                                            placeholder="Customer's name"
                                            disabled={true}
                                            inputContainerStyle={styles.input}
                                            containerStyle={{ paddingHorizontal: 0 }}
                                            value={customerName}
                                        />
                                        <Button
                                            title={pinScreen ? 'Purchase now' : 'Verify Transaction PIN'}
                                            onPress={() => setPinScreen(true) }
                                            disabled={!isValid}
                                            isSubmitting
                                            buttonStyle={styles.button}
                                            containerStyle={{ marginTop: 20 }}
                                        />
                                    </>
                                )}                               
                                
                            </>
                        )}
                    </Formik>
                </View>
            </View>

            <Loader 
                props={valueState.loader} 
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} 
            />

            <VerifyPin
                isVisible={pinScreen} 
                closePinScreen={() => setPinScreen(false)} 
                action={() =>  formRef.current.handleSubmit() } 
            />
        </>
    );
};