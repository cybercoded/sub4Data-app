import { View, Text, PermissionsAndroid, Platform } from "react-native";
import React from "react";
import {styles, theme, ScrollViewHeader, getData } from "../components/global";
import { Button, ButtonGroup, Input, Switch } from "react-native-elements";
import { Formik } from "formik";
import * as yup from "yup";
import delay from "lodash/delay";
import upperFirst from "lodash/upperFirst";
import { VerifyPin } from "./verifyPin";
import { closeAlert, showAlert } from "react-native-customisable-alert";
import axios from "axios";
import { selectContactPhone } from 'react-native-select-contact';

export const BuyAirtime = ({ route, navigation }) => {
  const { api_product_id, id, image, slug } = route.params;
  const [value, setValue] = React.useState(false);
  const [pinScreen, setPinScreen] = React.useState(false);
  const formRef = React.useRef();

  const [userData, setUserData] = React.useState([]);
  React.useEffect(() => {
    getData('basicData').then(res => {
        setUserData(res);
    });
  }, []);

  async function getPhoneNumber() {
    // on android we need to explicitly request for contacts permission and make sure it's granted
    // before calling API methods
    alert()
    if (Platform.OS === 'android') {
      const request = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );

      // denied permission
      if (request === PermissionsAndroid.RESULTS.DENIED) throw Error("Permission Denied");
      
      // user chose 'deny, don't ask again'
      else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) throw Error("Permission Denied");
    }
    
    // Here we are sure permission is granted for android or that platform is not android
    const selection = await selectContactPhone();
    if (!selection) {
        return null;
    }
            
    let { contact, selectedPhone } = selection;
    console.log(`Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`);
    return selectedPhone.number;
}
    

  return (
    <View style={styles.centerContainer}>
      <Formik
        innerRef={formRef}
        initialValues={{
          amount: '',
          phone: "",
          product_id: api_product_id,
        }}
        validateOnChange={true}
        validateOnMount={true}
        validationSchema={yup.object().shape({
          phone: yup
            .string()
            .required("Enter your phone number")
            .min(11, "Enter 11 digits format Nigerian phone number!")
            .max(11, "Enter 11 digits format Nigerian phone number!"),
          amount: yup
            .number()
            .typeError("Must be only digits")
            .required("Amount is required"),
        })}
        onSubmit={(values) => {
          axios.post(`airtime-purchase`, values).then((res) => {
              if (res.data.status === 2000) {
                showAlert({alertType: 'success' , title: 'Success', message: res.data.message});
                delay(() => {
                  closeAlert();
                  navigation.navigate("Home");
                }, 2000);
              } else {
                showAlert({alertType: 'error' , title: 'Error', message: `Internal error: Code[${res.data.message}]`});
              }
            });
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, isValid, errors, touched, values }) => (
          <>
            <View style={{ flex: 1 }}>
              <ScrollViewHeader
                image={image}
                title={`Purchase ${upperFirst(slug)} Airtime`}
                subTitle={`Wallet Balance = ${userData.balance}`}
              />
            </View>

            <View style={{ flex: 2, width: "100%" }}>
              <Input
                placeholder="Amount"
                value={values.amount}
                onChangeText={handleChange("amount")}
                onBlur={handleBlur("amount")}
                inputContainerStyle={styles.input}
                containerStyle={{ paddingHorizontal: 0 }}
                errorMessage={errors.amount && touched.amount && errors.amount}
              />
              <Input
                placeholder="Beneficiary number"
                value={values.phone}
                inputContainerStyle={styles.input}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                containerStyle={{ paddingHorizontal: 0 }}
                errorMessage={errors.phone && touched.phone && errors.phone}
              />

              <ButtonGroup
                containerStyle={{ height: 50, marginHorizontal: 0 }}
                buttons={["Select beneficiary", "Select contact"]}
              />
              <Button onPress={() => getPhoneNumber} title="Pick a phone number" />

              <View style={{ marginTop: 10 }}>
                <Button
                  title={pinScreen ? "Purchase now" : "Verify Transaction PIN"}
                  onPress={() => setPinScreen(true)}
                  disabled={!isValid}
                  isSubmitting
                  buttonStyle={styles.button}
                  containerStyle={{ marginTop: 20 }}
                />
              </View>

              <View style={styles.rowFlex}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold" }}>
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

      <VerifyPin
        isVisible={pinScreen}
        closePinScreen={() => setPinScreen(false)}
        action={() => formRef.current.handleSubmit()}
      />
    </View>
  );
};
