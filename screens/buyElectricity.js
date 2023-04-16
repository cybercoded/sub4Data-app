import { View, ScrollView } from 'react-native';
import React from 'react';
import { API, Loader, ScrollViewHeader, SkeletonView, styles } from '../components/global';
import { Button, Input } from 'react-native-elements';
import { Context } from '../components/userContext';
import { Formik } from 'formik';
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';
import * as yup from 'yup';
import { isEmpty } from 'lodash';

export const BuyElectricity = ({ route, navigation }) => {
    const { sub_service_name, task, amount, meter_number, main_service_logo, available_service_logo, product_code } = route.params;
    const { valueState, valueDispatch } = React.useContext(Context);
    const [userDetails, setUserDetails] = React.useState([]);
    const [isPinVerified, setIsPinVerified] = React.useState(false);
    
    React.useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });
        API.post(`meter-number-verify.php?userId=1&service=electric/`, {
            meter_number: meter_number,
            product_code: product_code,
            task: task
        })
        .then((res) => {
            if (res.data.status === true) {
                setUserDetails(res.data.data);
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
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
    }, []);

    return (
        <>
            <View style={styles.container}>
                <View style={{ flex: 2 }}>
                    <ScrollViewHeader
                        image={{ uri: main_service_logo }}
                        title={sub_service_name}
                        subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
                    />
                </View>

                <View style={{ flex: 4, width: '100%' }}>
                    <ScrollView>
                        <Formik
                            initialValues={{
                                meter_number: meter_number,
                                task: task,
                                product_code: product_code
                            }}
                            validationSchema={yup.object().shape({
                                meter_number: yup
                                    .string()
                                    .required('Enter your your card number')
                                    .min(11, 'Enter 11 digits!')
                                    .max(11, 'Enter 11 digits!'),
                                product_code: yup.string().required('Please secelect a product')
                            })}
                            onSubmit={(values) => {
                                valueDispatch({ loader: { ...dummies.modalProcess.loading } });
                                API.post(`buy-services.php?userId=${valueState.basicData.userId}&service=electric/`, {
                                    product_code: product_code,
                                    meter_number: meter_number,
                                    amount: amount
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
                            {({ handleSubmit, handleChange, handleBlur, setFieldValue, values }) => (
                                <>
                                    {isEmpty(userDetails) && <SkeletonView length={4} />}
                                    {Object.entries(userDetails)
                                        .filter(([key]) => !['phone', 'number', 'text_status'].includes(key))
                                        .map(([key, value], index) => (
                                            <Input
                                                key={index}
                                                multiline={true}
                                                inputContainerStyle={[styles.input, { paddingVertical: 7, margin: 0 }]}
                                                containerStyle={{ margin: 0 }}
                                                label={key}
                                                value={value}
                                                disabled={true}
                                            />
                                        ))
                                    }
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
                    </ScrollView>
                </View>
            </View>

            <Loader props={valueState.loader} handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} />
        </>
    );
};
