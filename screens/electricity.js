import { View } from 'react-native';
import React from 'react';
import { API, Loader, ScrollViewHeader, styles } from '../components/global';
import { Button, Icon, Input } from 'react-native-elements';
import { Context } from '../components/userContext';
import { Formik } from 'formik';
import { dummies } from '../components/dummies';
import delay from 'lodash';
import SelectDropdown from 'react-native-select-dropdown';
import * as yup from 'yup';
import axios from 'axios';

export const Electricity = ({ route, navigation }) => {
    const { service_code, service_name, main_service_logo, isPinVerified } = route.params;
    const [availableServices, setAvailableServices] = React.useState([]);
    const [availableSubServices, setAvailableSubServices] = React.useState([]);
    const [currentServices, setCurrentServices] = React.useState(0);

    const { valueState, valueDispatch } = React.useContext(Context);
    const formRef = React.useRef();
    const serviceRef = React.useRef({});
    const subServiceRef = React.useRef({});  


    const fetchData = (index) => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });    
        API.post(`get-sub-services.php?userId=1&service=others/get_available_services.php`, {
            service_code: service_code,
            sub_service_code: availableServices[index]['sub_service_code']
        })
        .then((res) => {
            setAvailableSubServices(res.data.data);
            subServiceRef.current.openDropdown()
            valueDispatch({ loader: { ...dummies.modalProcess.hide } });
        }).catch((error) => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: error.message } });
        });       
    }
    React.useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });
        API.post(`get-sub-services.php?userId=1&service=others/get_sub_services.php`, { service_code: service_code })
        .then((res) => {
            setAvailableServices(res.data.data);
            serviceRef.current.openDropdown()
            valueDispatch({ loader: { ...dummies.modalProcess.hide } });
        })
        .catch((error) => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: error.message } });
        });

    }, []);

    return (
        <>
            <View style={styles.container}>
                <View style={{ flex: 2 }}>
                    <ScrollViewHeader
                        image={{ uri: main_service_logo }}
                        title={`Purchase ${service_name.toUpperCase()}`}
                        subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
                    />
                </View>
                <View style={{ flex: 3 }}>
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            meter_number: '62141331165',
                            task: 'verify',
                            main_service_logo: main_service_logo,
                        }}
                        validationSchema={yup.object().shape({
                            meter_number: yup
                                .string()
                                .required('Enter your your card number')
                                .min(11, 'Enter 11 digits!')
                                .max(11, 'Enter 11 digits!')
                        })}
                        onSubmit={(values) => {
                            navigation.navigate('BuyElectricity', values);
                        }}
                    >
                        {({ handleSubmit, handleChange, handleBlur, isValid, errors, touched, setFieldValue, values }) => (
                            <>
                                <Input
                                    placeholder="Meter number"
                                    inputContainerStyle={styles.input}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    value={values.meter_number}
                                    onChangeText={handleChange('meter_number')}
                                    onBlur={handleBlur('meter_number')}
                                    errorMessage={errors.meter_number && touched.meter_number && errors.meter_number}
                                />

                                <SelectDropdown
                                    ref={serviceRef}
                                    data={availableServices.map((item) => item.sub_service_name)}
                                    onSelect={(selectedItem, index) => {
                                        fetchData(index);
                                        setFieldValue('sub_service_name', availableServices[index]['sub_service_name']);
                                    }}
                                    buttonStyle={[styles.button, { height: 'auto', marginBottom: 20 }]}
                                    renderDropdownIcon={() => <Icon name="menu-down" type="material-community" size={35} color="grey" />}
                                />

                                <SelectDropdown
                                    ref={subServiceRef}
                                    data={availableSubServices.map((item) => item.available_service_name)}
                                    onSelect={(selectedItem, index) => {
                                        setFieldValue('product_code', availableSubServices[index]['available_service_system_name']);
                                        setFieldValue('available_service_logo', availableSubServices[index]['available_service_logo']);
                                    }}
                                    buttonStyle={[styles.button, { height: 'auto', textAlign: 'center' }]}
                                    renderDropdownIcon={() => <Icon name="menu-down" type="material-community" size={35} color="grey" />}
                                />

                                <Button
                                    title="Verify my meter number"
                                    onPress={handleSubmit}
                                    buttonStyle={styles.button}
                                    containerStyle={{ marginTop: 20 }}
                                    disabled={!isValid}
                                />
                            </>
                        )}
                    </Formik>
                </View>
            </View>

            <Loader props={valueState.loader} handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })} />
        </>
    );
};
