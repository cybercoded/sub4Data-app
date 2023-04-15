import { View, SafeAreaView } from 'react-native';
import React from 'react';
import { API, Loader, ScrollViewHeader, styles } from '../components/global';
import { Button, Icon, Input } from 'react-native-elements';
import { Context } from '../components/userContext';
import { Formik } from 'formik';
import { dummies } from '../components/dummies';
import * as yup from 'yup';

export const BuyCable = ({ route, navigation }) => {
    const { product_code, sub_service_name, amount, sub_service_image } = route.params;
    const { valueState, valueDispatch } = React.useContext(Context);
    const [isPinVerified, setIsPinVerified] = React.useState(false);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 2 }}>
                    <ScrollViewHeader
                        image={sub_service_image}
                        title={sub_service_name}
                        subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
                    />
                </View>
                <View style={{ flex: 4 }}>
                    <Formik
                        validateOnChange={true}
                        initialValues={{
                            smartcard_number: '62141331165',
                            amount: amount
                        }}
                        validationSchema={yup.object().shape({
                            smartcard_number: yup
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
                            valueDispatch({ loader: { ...dummies.modalProcess.loading } });
                            API.post(`buy-services.php?userId=${valueState.basicData.userId}&service=tv/`, {
                                product_code: product_code,
                                smartcard_number: smartcard_number,
                            })
                            .then((res) => {
                                if (res.data.status === true) {
                                    valueDispatch({
                                        loader: {
                                            ...dummies.modalProcess.success,
                                            text: res.data.message
                                        }
                                    });
                                    delay(() => {
                                        valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                                        navigation.navigate('Dashboard');
                                    }, 5000);
                                } else {
                                    valueDispatch({
                                        loader: {
                                            ...dummies.modalProcess.error,
                                            title: res.data.message,
                                            text: 'please try again!'
                                        }
                                    });
                                }
                            })
                            .catch((error) => {
                                valueDispatch({ loader: { ...dummies.modalProcess.error, text: error.message } });
                                console.error(error.message);
                            });
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
                                    keyboardType='number-pad'
                                    onChangeText={handleChange('amount')}
                                    onBlur={handleBlur('amount')}
                                    errorMessage={errors.amount && touched.amount && errors.amount}
                                />

                                <Button
                                    title={isPinVerified ? 'Purchase now' : 'Verify Transaction PIN'}
                                    onPress={() => {
                                        isPinVerified ? handleSubmit() : navigation.navigate('VerifyPin');
                                        setIsPinVerified(true);
                                    }}
                                    buttonStyle={styles.button}
                                    containerStyle={{ marginTop: 20 }}
                                />
                            </>
                        )}
                    </Formik>
                </View>
            </SafeAreaView>

            <Loader props={valueState.loader} handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} />
        </>
    );
};
