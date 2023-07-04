import { View, Text } from 'react-native'
import React from 'react'
import { Button, Icon, Input } from 'react-native-elements';
import { Loader, storeData, styles, theme } from '../components/global';
import { Formik } from 'formik';
import * as yup from "yup";

import { dummies } from '../components/dummies';
import delay from 'lodash/delay';
import { closeAlert, showAlert } from 'react-native-customisable-alert';

export const UpdateProfile = ({navigation}) => {
    const formRef = React.useRef();
    const {valueState, valueDispatch} = React.useContext(Context);

    return (
        <>
            <View style={styles.centerContainer}>
                <Formik
                    innerRef={formRef}
                    initialValues={{
                        name: valueState.basicData.name,
                        email: valueState.basicData.email
                    }}
                    validationSchema={yup.object().shape({
                        name: yup
                        .string()
                        .required("Enter your full names")
                        .min(7, "Min of 7 characters is required!")
                        .max(30, "Max of 30 characters is required!")
                    })}

                    onSubmit={(values) => {
                        axios.post(`update-user`, values).then((res) => {
                            if ( res.data.status === 200 ) {
                                showAlert({alertType: 'success' , title: 'Success', message:  res.data.message+', please wait to be refreshed'});
                                axios.get(`get-user`).then((res) => {
                                    if ( res.data.status === 200) {                                       
                                        storeData('basicData', {...res.data.data});
                                        showAlert({alertType: 'success' , title: 'Success', message:  res.data.message});                                
                                        delay(() => {
                                            closeAlert();
                                            navigation.navigate('Home');
                                        }, 2000);                                
                                    }
                                });
                            } else {
                                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
                            }
                        });
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, errors, touched, values}) => (
                        <>
                            <View style={{flex: 10, width: '100%'}}>                           

                                <Input
                                    inputContainerStyle={styles.input}      
                                    leftIcon={<Icon name="account-circle" size={30} />}
                                    placeholder="Enter Name"
                                    label="Email address"
                                    disabled={true}
                                    value={values.email}
                                    containerStyle={{paddingHorizontal: 0}} 
                                />
                                <Input
                                    inputContainerStyle={styles.input}      
                                    leftIcon={<Icon name="person-outline" size={30} />}
                                    placeholder="Enter full names"
                                    label="Full names"
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    containerStyle={{paddingHorizontal: 0}} 
                                    errorMessage={
                                        errors.name && touched.name && errors.name
                                    }
                                />
                            </View>

                            <View style={{flex: 1, width: '100%'}}>
                                <Button onPress={handleSubmit} buttonStyle={styles.button} title='Update details' />
                            </View>
                        </>
                    )}
                </Formik>
            </View>
        </>
    )
};