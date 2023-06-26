import { View, Text, Image, Modal } from 'react-native'
import React from 'react'
import { BASE_URL, Loader, styles, themes } from '../components/global';
import { Button, Input } from 'react-native-elements';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

export const ForgotPassword = ({navigation}) => {
    const [loader, setLoader] = React.useState({
        visibile: false,
        icon:  'loader', //'highlight-off' 'check-circle-outline',
        text: 'Please wait',
        actions: true,
        color: theme.color.primary,
    });

    const toggleModal = () => {
        setLoader( (previous) => ( {...loader, visibile: !loader.visibile}) );
    }

    return (
        <View style={styles.centerContainer}>
            <View style={{width: '100%'}}>
                <View style={{marginBottom: 40, alignItems: 'center'}}>
                    <Image style={{height: 100, width: 100}} source={{uri: `${BASE_URL}img/mtn-img.jpg`}} />
                    <Text style={{marginVertical: 20, fontSize: 700}}>You forgot your password?</Text>
                    <Text style={{textAlign: 'center'}}>Don't worry you can still reset your password, just enter your verified email address</Text>
                </View>

                <Formik
                        initialValues={{
                            email: 'cafeat9ja@gmail.coms',
                        }}
                        validateOnChange={false}
                        validationSchema={ 
                            yup.object().shape({
                                email: yup.string().email('Invalid email').required('Enter your email address'),
                            })
                        }
                        onSubmit={values => {
                            toggleModal()
                            axios.post(`${API_URL}handle/check-login.php`, values).then((res) => {   
                                if ( res.data != false ) {
                                    setLoader({...loader, visibile: true, actions: false, icon: 'check-circle-outline', color: theme.color.primary, text: 'Login Successful, please wait a minute to be redirected'})
                                    setTimeout(() => {
                                        toggleModal()
                                        navigation.navigate('Dashboard', {
                                            userId: res.data
                                        })
                                    }, 5000);
                                }else {
                                    setLoader({...loader, visibile: true, icon: 'highlight-off', color: 'red', actions: true, text: 'Something went wrong'})
                                }
                            }).catch( (err) => {
                                setLoader({...loader, visibile: true, icon: 'highlight-off', color: 'red', actions: true, text: err.message})
                            })
                        }}>
                        {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
                        <View>
                            <Modal animationType="slide" visible={loader.visibile} transparent={true}><Loader handleRetry={handleSubmit} handler={toggleModal} props={loader} /></Modal>
                            <Input 
                                placeholder='Email address' 
                                inputContainerStyle={styles.input} 
                                containerStyle={{paddingHorizontal: 0}} 
                                inputStyle={{outline: 0}}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                errorMessage={errors.email && touched.email && errors.email}
                            />

                            <Button onPress={handleSubmit} title='Send reset code' buttonStyle={styles.button} containerStyle={{marginTop: 40}}/>
                            
                        </View>
                        )}
                    </Formik>
            </View>
        </View>
    )
};