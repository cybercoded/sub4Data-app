import React from 'react';
import { Image, Modal, Pressable, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import { API, API_URL, BASE_URL, errorHandler, getData, Loader, ScrollViewHeader, storeData, styles, theme } from '../components/global';
import { Button, Icon, Input, Text } from 'react-native-elements';
import * as yup from 'yup';
import { delay, isObject } from 'lodash';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';

export const Signin = ({navigation}) => {

    const [passwordVisibility, setPasswordVisibility] = React.useState(true);

    const { valueState, valueDispatch } = React.useContext(Context);


    return(
        <View style={styles.container}>
            <View style={{flex: 1, width: '100%'}}>

                <ScrollViewHeader
                    image={dummies.images.networks.icon}
                    title='Register with sub4Data'
                />

                <Formik
                    initialValues={{
                        email: 'cafeat9ja@gmail.coms',
                        password: 'password',
                    }}
                    validateOnChange={false}
                    validationSchema={ 
                        yup.object().shape({
                            email: yup.string().email('Invalid email').required('Enter your email address'),
                            password: yup.string().required('Enter your passsword').matches(/^[a-zA-Z0-9_-]{5,15}$/, 'Should be 5-15 characters, lowercase, uppercase or numbers')
                        })
                    }
                    onSubmit={values => {
                        valueDispatch({loader: {...dummies.modalProcess.loading}})
                        API.post('check-login.php', values).then((res) => {   
                            let userId = res.data.userId;
                            if ( res.data.status ) {
                                valueDispatch({loader: {...dummies.modalProcess.success, text: 'Login Successful, please wait to be redirected to dashboard'}})
                                API.get(`getdata.php?userId=${userId}`).then((res) => {
                                    if ( isObject(res.data.data) && res.data.status == true) {                                       
                                        storeData('basicData', {...res.data.data, isLoggedIn: true});
                                        delay(() => {
                                            navigation.navigate('Dashboard')
                                            valueDispatch({loader: {visible: false}})
                                        }, 2000);                                        
                                    }
                                });
                            }else {
                                valueDispatch({loader: {...dummies.modalProcess.error, text: 'Something went wrong, please try again later'}});
                            }
                        }).catch( (error) => {
                            valueDispatch({loader: {...dummies.modalProcess.error, text: error.message}})                        })
                    }}>
                    {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
                    <View>
                         <Loader
                            submittion={handleSubmit}
                            handler={() => valueDispatch({loader: {...valueState.loader, visible: false}})}
                            props={valueState.loader}
                        /> 
                        <Input 
                            placeholder='Email address' 
                            inputContainerStyle={styles.input} 
                            containerStyle={{paddingHorizontal: 0}} 
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            errorMessage={errors.email && touched.email && errors.email}
                        />
                        <Input 
                            placeholder='Password' 
                            inputContainerStyle={styles.input} 
                            containerStyle={{paddingHorizontal: 0}} 
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={passwordVisibility}
                            rightIcon={<Icon name={passwordVisibility ? 'visibility' : 'visibility-off'} size={35} color={theme.colors.gray} onPress={() => setPasswordVisibility(!passwordVisibility) } />}
                            errorMessage={errors.password && touched.password && errors.password}
                        />
                        
                        <Pressable onPress={() => navigation.navigate('ForgetPassword') } style={{marginLeft: 10, flex: 1, alignItems: 'center'}} >
                            <Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>Forget password?</Text>
                        </Pressable>


                        <Button onPress={handleSubmit} title='Sign in to your account' buttonStyle={styles.button} containerStyle={{marginTop: 40}}/>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <View style={styles.rowFlex}>
                                <Text>Don't have an account?</Text>
                                <Pressable onPress={() => navigation.navigate('Registration') } style={{marginLeft: 10}} ><Text style={{color: theme.colors.primary, fontWeight: 'bold'}}>Sign up</Text></Pressable>
                            </View>
                        </View>
                    </View>
                    )}
                </Formik>
            </View>
        </View>
    );
};