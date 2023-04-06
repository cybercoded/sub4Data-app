import { View, Text, Image, Modal } from "react-native";
import React, { useState } from "react";
import {
  BASE_URL,
  styles,
  Loader,
  API,
  theme,
  ScrollViewHeader,
} from "../components/global";
import { Button, ButtonGroup, Input, Switch } from "react-native-elements";
import { Formik } from "formik";
import * as yup from "yup";
import { Context, LoaderView } from "../components/userContext";
import debounce from "lodash/debounce";
import { dummies } from "../components/dummies";
import delay from "lodash/delay";

export const Airtime = ({ route, navigation }) => {
  const { isPinVerified, network } = route.params;
  const [value, setValue] = React.useState(false);
  const [passwordVisibility, setPasswordVisibility] = React.useState(true);
  const [isReferred, setIsReferred] = React.useState(false);
  const {valueState, valueDispatch} = React.useContext(Context);
  const formRef = React.useRef();

  React.useEffect(() => {

    if( isPinVerified === true) {
      if (formRef.current) {
        formRef.current.handleSubmit()
      }
    }

  }, []);

  return (
    <View style={styles.container}>
      
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
            <Loader
              submittion={handleSubmit}
              handler={() => valueDispatch({loader: {...dummies.modalProcess.hide}})}
              props={valueState.loader}
            />
            <View style={{flex: 1}}>
              <ScrollViewHeader
                  image={dummies.images.networks[network]}
                  title={`Purchase ${network.toUpperCase()} Data`}
                  subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
              />
            </View>

            <View style={{flex: 2}}>
              <Input
                placeholder="Amount"
                value={values.amount}
                inputContainerStyle={styles.input}
                containerStyle={{ paddingHorizontal: 0 }}
              />
              <Input
                placeholder="Beneficiary number"
                value={values.phone}
                inputContainerStyle={styles.input}
                containerStyle={{ paddingHorizontal: 0 }}
              />


              <ButtonGroup 
                containerStyle={{height: 50, marginHorizontal: 0}} 
                buttons={['Select beneficiary', 'Select contact']} 
              />

              <View style={{marginTop: 10}}>
                <Button
                  title="Proceed"
                  onPress={() => navigation.navigate('VerifyPin', {landingPage: 'Airtime'})}
                  buttonStyle={styles.button}
                />
              </View>

              <View style={styles.rowFlex}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Save to beneficiary
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Switch
                    color={theme.colors.primary}
                    value={value}
                    onValueChange={() => setValue(!value)}
                  />
                </View>
              </View>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};
