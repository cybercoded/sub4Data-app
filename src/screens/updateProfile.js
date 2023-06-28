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
                        valueDispatch({loader: {...dummies.modalProcess.loading}});
                        API.post(`update-user`, values).then((res) => {
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
                                }).catch((err) => {
                                    valueDispatch({ loader: { ...dummies.modalProcess.error, text: err.message }});
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
            <Loader
                handleRetry={() => formRef.current.handleSubmit()}
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } }) }
                props={valueState.loader}
            />
        </>
    )
};