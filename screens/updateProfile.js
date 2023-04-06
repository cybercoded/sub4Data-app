import { View, Text } from 'react-native'
import React from 'react'
import { Button, Icon, Input } from 'react-native-elements';
import { API, Loader, storeData, styles, theme } from '../components/global';
import { Formik } from 'formik';
import * as yup from "yup";
import { Context } from '../components/userContext';
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';

export const UpdateProfile = ({navigation}) => {

    const {valueState, valueDispatch} = React.useContext(Context);

    return (
        <View style={styles.container}>

            <Formik
                initialValues={{
                    fullNames: valueState.basicData.fullName,
                    email: valueState.basicData.email,
                    phoneNumber: valueState.basicData.tel,
                }}
                validationSchema={yup.object().shape({
                    fullNames: yup
                    .string()
                    .required("Enter your full names")
                    .min(7, "Min of 7 characters is required!")
                    .max(30, "Max of 30 characters is required!"),
                    phoneNumber: yup
                    .string()
                    .required("Enter your phone number")
                    .min(11, "Enter 11 digits fornat Nigerian phone number!")
                    .max(11, "Enter 11 digits fornat Nigerian phone number!")
                })}

                onSubmit={(values) => {
                    valueDispatch({loader: {...dummies.modalProcess.loading}});
                    API.put(`update-profile.php?userId=${valueState.basicData.userId}`, values)
                    .then((res) => {
                        if ( res.data.status === true ) {
                        valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message+', please wait to be refreshed'}});
                        API.get(`getdata.php?userId=${valueState.basicData.userId}`).then((res) => {
                            
                            if ( res.data.status === true ) {
                                valueDispatch({basicData: res.data.data});
                                storeData("basicData", res.data.data);

                                delay(() => {
                                    valueDispatch({loader: {...valueState.loader, visible: false}});                     
                                    navigation.navigate("Dashboard");
                                }, 2000);
                            }
                        });
                        } else {
                            valueDispatch({loader: {...dummies.modalProcess.error, text: 'Something went wrong'}});
                        }
                    })
                    .catch((err) => {
                        valueDispatch({loader: {...dummies.modalProcess.error, text: err.message}});
                        console.error(err.message);
                    });
                }}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    errors,
                    touched,
                    values,
                }) => (
                    <>
                        <Loader
                            submittion={handleSubmit}
                            handler={() => valueDispatch({loader: {...valueState.loader, visible: false}})}
                            props={valueState.loader}
                        />

                        <View style={{flex: 10}}>
                            <Input
                                inputContainerStyle={styles.input}      
                                leftIcon={<Icon name="account-circle" size={30} />}
                                placeholder="Enter Name"
                                label="Email address"
                                disabled={true}
                                value={values.email}
                            />
                            <Input
                                inputContainerStyle={styles.input}      
                                leftIcon={<Icon name="person-outline" size={30} />}
                                placeholder="Enter full names"
                                label="Full names"
                                value={values.fullNames}
                                onChangeText={handleChange("fullNames")}
                                onBlur={handleBlur("fullNames")}
                                errorMessage={
                                    errors.fullNames && touched.fullNames && errors.fullNames
                                }
                            />

                            <Input
                                inputContainerStyle={styles.input}      
                                leftIcon={<Icon name="smartphone" size={30} />}
                                placeholder="Enter telephone numer"
                                label="Phone number"
                                value={values.phoneNumber}
                                onChangeText={handleChange("phoneNumber")}
                                onBlur={handleBlur("phoneNumber")}
                                errorMessage={
                                    errors.phoneNumber &&
                                    touched.phoneNumber &&
                                    errors.phoneNumber
                                }
                            />
                        </View>

                        <View style={{flex: 1, width: '100%'}}>
                            <Button onPress={handleSubmit} buttonStyle={styles.button} title='Update detials' />
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
};