import React from "react";
import { styles } from "../components/global";
import { View, Text, Image } from "react-native";
import { dummies } from "../components/dummies";
import { Button, Divider, Input } from "react-native-elements";
import { Formik } from "formik";
import * as yup from 'yup';
import { showAlert } from 'react-native-customisable-alert';

export const MerchantPayment = ({ navigation }) => {
      const [charges, setCharges] = React.useState(3);
    const [discount, setDiscount] = React.useState(3);
    const [total, setTotal] = React.useState();
    const formRef = React.useRef();

    return (
        <>
            <View style={styles.centerContainer}>
                <Formik
                    innerRef={formRef}
                    initialValues={{
                        amount: '',
                    }}
                    validateOnChange={true}
                    validateOnMount={true}
                    validationSchema={yup.object().shape({
                    amount: yup
                        .number()
                        .min(100, "Minimum amount is 100")
                        .max(5000, "Maximum amount is 5000")
                        .required("Amount is required")
                    })}
                    onSubmit={(values) => {
                        axios.post(`merchant-pay`, values).then((res) => {
                            if (res.data.status === 200 &&  res.data.url) {
                                navigation.navigate("WebViewComponent", {url: res.data.url});
                            } else {
                                showAlert({alertType: 'error' , title: 'Error', message: `Internal error: Code[${res.data.message}]`});
                            }
                        });
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, isValid, errors, touched, values }) => (
                    <>
                        <View style={{ flex: 8, width: "100%" }}>
                            <Input
                                placeholder="Amount"
                                value={values.amount}
                                onChangeText={amount => {
                                    let charges = (amount * discount) / 100;
                                    let total = (amount * discount) / 100 + Number(amount);
                                    setCharges('₦' + new Intl.NumberFormat().format(charges));
                                    setTotal('₦' + new Intl.NumberFormat().format(total));

                                    setFieldValue('amount', amount);
                                }}
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
                            <View>
                                <Text>Accepted Cards</Text>
                                <Image source={dummies.images.cards} resizeMode="contain" style={{ width: 200, height: 80 }} />
                            </View>

                            <View>
                                <View style={styles.rowFlexBasis}>
                                    <Text>Transaction charge</Text>
                                    <Text>{charges}</Text>
                                </View>
                                <Divider />
                                <View style={styles.rowFlexBasis}>
                                    <Text>Total</Text>
                                    <Text>{total}</Text>
                                </View>
                                <Divider />
                            </View>
                            <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
                                <Image source={dummies.images.monnify} resizeMode="contain" style={{height: 70, width: 100}} />
                            </View>
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
