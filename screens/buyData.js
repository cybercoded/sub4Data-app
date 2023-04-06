import { View, Image, Button as MyButton, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import React from 'react';
import { API, BASE_URL, styles, theme, Loader, PinVerifyPad, ScrollViewHeader } from '../components/global';
import { Button, Input, Switch, BottomSheet, Text, ButtonGroup } from 'react-native-elements';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import delay from 'lodash/delay';
import { Formik } from 'formik';

export const BuyData = ({ route, navigation }) => {
    const { network, product_code, description, amount } = route.params;
    const [value, setValue] = React.useState(false);
    const [bottomModal, setBottomModal] = React.useState(false);
    const [pinInputText, setPinInputText] = React.useState('');
    const [pinPadDisability, setPinPadDisability] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const { valueState, valueDispatch } = React.useContext(Context);
    const [phone, setPhone] = React.useState('');

    const formRef = React.useRef();

    React.useEffect(() => {

        if( isPinVerified === true) {
        if (formRef.current) {
            formRef.current.handleSubmit()
        }
        }

    }, []);

    const pinInput = (val) => {
        if (pinInputText.length == 4) {
            setPinPadDisability(true);
        } else {
            setPinInputText(`${pinInputText}${val}`);
        }
    };

    const verifyPinHandler = () => {
        valueDispatch({ loader: { ...valueState.loader, visibile: true, icon: 'loader' } });
        API.post(`check-pin.php?userId=${valueState.basicData.userId}`, {
            pin: pinInputText
        }).then((res) => {
            if (res.data.status) {
                valueDispatch({
                    loader: {
                        ...dummies.modalProcess.success,
                        text: (
                            <View>
                                <View>
                                    <Text style={{ fontWeight: 'bold' }}>{res.data.message}</Text>
                                </View>
                                <Text> please wait while we process your purchace</Text>
                            </View>
                        ),
                        icon: 'loader'
                    }
                });

                API.post(`buy-services.php?userId=${valueState.basicData.userId}&service=datashare`, {
                    product_code: product_code,
                    phone: phone
                }).then((res) => {
                    if (res.data.status === true) {
                        valueDispatch({
                            loader: {
                                ...dummies.modalProcess.success,
                                text: (
                                    <View>
                                        <View>
                                            <Text style={{ fontWeight: 'bold' }}>{res.data.message}</Text>
                                        </View>
                                        <Text> please wait while we redirect you to the homepage</Text>
                                    </View>
                                )
                            }
                        });

                        delay(() => {
                            navigation.navigate('Dashboard');
                        }, 5000);
                    } else {
                        valueDispatch({
                            loader: {
                                ...dummies.modalProcess.error,
                                text: (
                                    <View>
                                        <View>
                                            <Text style={{ fontWeight: 'bold' }}>{res.data.message}</Text>
                                        </View>
                                        <Text> please try again!</Text>
                                    </View>
                                )
                            }
                        });
                    }
                });
            } else {
                valueDispatch({
                    loader: {
                        ...dummies.modalProcess.error,
                        text: (
                            <View>
                                <View>
                                    <Text style={{ fontWeight: 'bold' }}>{res.data.message}</Text>
                                </View>
                                <Text> please try again!</Text>
                            </View>
                        )
                    }
                });
            }
        });
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={{flex: 2}}>
                <ScrollViewHeader
                    image={dummies.images.networks[network]}
                    title={`Purchase ${network.toUpperCase()} Data`}
                    subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
                />
            </View>

            <View style={{flex: 4}}>
                <Formik
                    innerRef={formRef}
                    initialValues={{
                    amount: "100",
                    phone: "09036989565",
                    product_code: `${network}_custom`,
                    }}
                    validateOnChange={true}
                    validationSchema={yup.object().shape({
                    phone: yup
                        .string()
                        .required("Enter your phone number")
                        .min(11, "Enter 11 digits fornat Nigerian phone number!")
                        .max(11, "Enter 11 digits fornat Nigerian phone number!"),
                    amount: yup.string().required("Amount is required"),
                    })}
                    onSubmit={(values) => {
                        valueDispatch({loader: {...dummies.modalProcess.loading}});
                        API.post(`buy-services.php?userId=${valueState.basicData.userId}&service=airtime/`, values)
                        .then((res) => {
                            if (res.data.status === true) {
                            valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message}});                 
                            delay(() => {
                                valueDispatch({loader: {...dummies.modalProcess.hide}});                        
                                navigation.navigate("Dashboard");                      
                            }, 2000);
                            }else {
                            valueDispatch({loader: {...dummies.modalProcess.error, 
                                text: `Internal error: Code[${res.data.message}]`
                            }});
                            }
                        })
                        .catch((error) => {
                        valueDispatch({loader: {...dummies.modalProcess.error, text: error.message}});  
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
                            <Input
                                disabled={true}
                                value={description}
                                inputContainerStyle={styles.input}
                                containerStyle={{ paddingHorizontal: 0 }}
                            />
                            <Input
                                disabled={true}
                                value={amount}
                                inputContainerStyle={styles.input}
                                containerStyle={{ paddingHorizontal: 0 }}
                            />
                            <Input
                                placeholder="Beneficiary number"
                                inputContainerStyle={styles.input}
                                containerStyle={{ paddingHorizontal: 0 }}
                                value={phone}
                                onChangeText={(e) => setPhone(e.target.value)}
                            />
                            
                            <ButtonGroup
                                containerStyle={{height: 50, marginHorizontal: 0}} 
                                buttons={['Select beneficiary', 'Select contact']} 
                            />

                            <View style={styles.rowFlex}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Save to beneficiary</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Switch color={theme.colors.primary} value={value} onValueChange={() => setValue(!value)} />
                                </View>
                            </View>

                            <Button
                                title="Proceed"
                                onPress={() => navigation.navigate('VerifyPin', {landingPage: 'BuyData'})}
                                buttonStyle={styles.button}
                            />
                        </>
                    )}
                </Formik>
            </View>
        </View>
    );
};
