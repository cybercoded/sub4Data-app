import { View, Text, Image, Modal } from "react-native";
import React, { useState } from "react";
import {
  BASE_URL,
  styles,
  Loader,
  API,
  LOCAL_API,
} from "../components/global";
import { Button, Input, Switch } from "react-native-elements";
import { Formik } from "formik";
import * as yup from "yup";
import { Context, LoaderView } from "../components/userContext";
import debounce from "lodash/debounce";

export const Airtime = ({ route, navigation }) => {
  const { network } = route.params;
  const [value, setValue] = React.useState(false);
  const [passwordVisibility, setPasswordVisibility] = React.useState(true);
  const [isReferred, setIsReferred] = React.useState(false);
  const {valueState, valueDispatch} = React.useContext(Context);

  return (
    <View style={styles.centerContainer}>
      <Formik
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
            valueDispatch({visibile: true});
            API.post(`buy-services.php?userId=${valueState.userId}&service=airtime/`, values)
            .then((res) => {
                if (res.data.status === true) {
                    valueDispatch({
                        icon: "check-circle-outline",
                        color: "green",
                        actions: true,
                        text: res.data.message,
                    });                    
                    debounce(function () {                        
                        navigation.navigate("Dashboard");
                        valueDispatch({visibile: false});
                    }, 5000)();
                }else {
                    valueDispatch({
                        visibile: true,
                        icon: "highlight-off",
                        color: "red",
                        actions: true,
                        text: `Internal error: Code[${res.data.message}]`,
                    });
                }
            })
            .catch((err) => {
              valueDispatch({
                ...valueState,
                visibile: true,
                icon: "highlight-off",
                color: "red",
                actions: true,
                text: err.message,
              });
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
          <View>
            <Modal
              animationType="slide"
              visible={valueState.visibile}
              transparent={true}
            >
              <Loader
                submittion={handleSubmit}
                handler={() => valueDispatch({visibile: !valueState.visibile})}
                props={valueState}
              />
            </Modal>
            <View style={{ marginVertical: 20, alignItems: "center" }}>
              <Image
                style={{ height: 100, width: 100 }}
                source={{ uri: `${BASE_URL}img/${network}-img.jpg` }}
              />
              <Text style={{ marginVertical: 10 }}>MTN Airtime VTU</Text>
              <Text>Wallet Balance = 0.0</Text>
            </View>

            <Input
              placeholder="Amount"
              value={values.amount}
              inputContainerStyle={styles.input}
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{ outline: 0 }}
            />
            <Input
              placeholder="Beneficiary number"
              value={values.phone}
              inputContainerStyle={styles.input}
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{ outline: 0 }}
            />

            <View style={{ width: "100%" }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Button title="Beneficiary lists" type="outline" />
                </View>
                <View style={{ width: 5 }}></View>
                <View style={{ flex: 1 }}>
                  <Button
                    titleProps={{ numberOfLines: 1 }}
                    title="Select from phone"
                    type="outline"
                  />
                </View>
              </View>
            </View>

            <Button
              title="Buy"
              onPress={handleSubmit}
              buttonStyle={styles.button}
              containerStyle={{ width: "100%", marginVertical: 20 }}
            />

            <View style={{ width: "100%" }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 700 }}>
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
          </View>
        )}
      </Formik>
    </View>
  );
};
