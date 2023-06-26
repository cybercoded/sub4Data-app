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

export const BuyElectricity = ({ route, navigation }) => {
    const { id, name, image } = route.params;
    const { valueState, valueDispatch } = React.useContext(Context);
    const formRef = React.useRef();
    const [pinScreen, setPinScreen] = React.useState(false);
    const [customerName, setCustomerName] = React.useState('');

    const handleVerifyPin = (meter_number, service_id) => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });
        API.post(`meternumber-verification`, {meter_number: meter_number, service_id: service_id}).then((res) => {
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
                            meter_number: '54150268040',
                            service_id: id,
                            amount: '200'
                        }}
                        validateOnMount={true}
                        validationSchema={yup.object().shape({
                            meter_number: yup
                                .string()
                                .label('Card number')
                                .typeError('Must be only digits')
                                .required('Enter your your card number')
                                .min(11, 'Enter 11 digits!')
                                .max(11, 'Enter 11 digits!'),
                            amount: yup
                                .number()
                                .typeError('Must be only digits')
                                .label('Amount to purchase')
                                .required('Enter amount to purchase')
                                .min(200, 'Enter N200 and above!')
                                .max(2000, 'Enter N20,000 and above!')
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
                                    value={values.meter_number}
                                    onChangeText={handleChange('meter_number')}
                                    onBlur={handleBlur('meter_number')}
                                    keyboardType='number-pad'
                                    errorMessage={errors.meter_number && touched.meter_number && errors.meter_number}
                                />

                                <Input
                                    placeholder="Amount to purchase"
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    value={values.amount}
                                    keyboardType='number-pad'
                                    onChangeText={handleChange('amount')}
                                    onBlur={handleBlur('amount')}
                                    errorMessage={errors.amount && touched.amount && errors.amount}
                                />

                                { customerName == '' ? (
                                    <Button
                                        title="Verify my meter number"
                                        onPress={() => handleVerifyPin(values.meter_number, values.service_id)}
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
