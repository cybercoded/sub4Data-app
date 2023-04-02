import React from 'react';
import { Image, Modal, Pressable, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import { API, API_URL, BASE_URL, errorHandler, getData, Loader, storeData, styles, theme } from '../components/global';
import { Button, Icon, Input, Text } from 'react-native-elements';
import * as yup from 'yup';
import { isObject } from 'lodash';

export const Signin = ({navigation}) => {

    const [passwordVisibility, setPasswordVisibility] = React.useState(true);
    const [loader, setLoader] = React.useState({
        visibile: false,
        icon:  'loader', //'highlight-off' 'check-circle-outline',
        text: 'Please wait',
        actions: true,
        color: theme.colors.primary,
    });

    const toggleModal = () => {
        setLoader(prevState => ({
            ...prevState, visibile: !prevState.visibile
        }));
    }

    return(
        <View style={styles.centerContainer}>
            <View style={{width: '100%'}}>

                <View style={{marginVertical: 20, alignItems: 'center'}}>
                    <Image style={{height: 100, width: 100}} source={{uri: `${BASE_URL}img/mtn-img.jpg`}} />
                    <Text style={{marginVertical: 10, fontSize: 700}}>Sign in to your account on Tommytop</Text>
                </View>

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
                        toggleModal()
                        API.post('check-login.php', values).then((res) => {   
                            let userId = res.data.userId;
                            if ( res.data.status ) {
                                setLoader({...loader, visibile: true, actions: false, icon: 'check-circle-outline', color: theme.colors.primary, text: 'Login Successful, please wait a minute to be redirected'})
                                API.get(`getdata.php?userId=${userId}`).then((res) => {
                                    if ( isObject(res.data.data) && res.data.status == true) {                                       
                                        storeData('basicData', res.data.data);
                                        storeData('isLoggedIn', true);
                                        setTimeout(() => {
                                            navigation.navigate('Dashboard', {
                                                userId: userId
                                            })
                                            toggleModal()
                                        }, 5000);                                        
                                    }
                                });
                            }else {
                                setLoader({...loader, visibile: true, icon: 'highlight-off', color: 'red', actions: true, text: 'Something went wrong'})
                            }
                        }).catch( (error) => {
                            setLoader({...loader, visibile: true, icon: 'highlight-off', color: 'red', actions: true, text: error.message});
                        })
                    }}>
                    {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => (
                    <View>
                        <Modal animationType="slide" visible={loader.visibile} transparent={true}><Loader submittion={handleSubmit} handler={toggleModal} props={loader} /></Modal>
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
                        <Input 
                            placeholder='Password' 
                            inputContainerStyle={styles.input} 
                            containerStyle={{paddingHorizontal: 0}} 
                            inputStyle={{outline: 0}}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={passwordVisibility}
                            rightIcon={<Icon name={passwordVisibility ? 'visibility' : 'visibility-off'} size={35} color={theme.colors.gray} onPress={() => setPasswordVisibility(!passwordVisibility) } />}
                            errorMessage={errors.password && touched.password && errors.password}
                        />
                        
                        <Pressable onPress={() => navigation.navigate('ForgetPassword') } style={{marginLeft: 10, flex: 1, alignItems: 'center'}} >
                            <Text style={{color: theme.colors.primary, fontSize: 700}}>Forget password?</Text>
                        </Pressable>


                        <Button onPress={handleSubmit} title='Sign in to your account' buttonStyle={styles.button} containerStyle={{marginTop: 40}}/>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <View style={styles.rowFlex}>
                                <Text>Don't have an account?</Text>
                                <Pressable onPress={() => navigation.navigate('Registration') } style={{marginLeft: 10}} ><Text style={{color: theme.colors.primary, fontSize: 700}}>Sign up</Text></Pressable>
                            </View>
                        </View>
                    </View>
                    )}
                </Formik>
            </View>
        </View>
    );
};