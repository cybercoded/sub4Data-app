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
import { Context } from "../components/userContext";
import { dummies } from "../components/dummies";
import delay from "lodash/delay";
import upperFirst from "lodash/upperFirst";
import { VerifyPin } from "./verifyPin";

export const BuyAirtime = ({ route, navigation }) => {
  const { api_product_id, id, image, slug } = route.params;
  const [value, setValue] = React.useState(false);
  const { valueState, valueDispatch } = React.useContext(Context);
  const [pinScreen, setPinScreen] = React.useState(false);
  const formRef = React.useRef();

  return (
    <View style={styles.container}>
      <Formik
        innerRef={formRef}
        initialValues={{
          amount: 100,
          phone: "09036989565",
          api_product_id: api_product_id,
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
          valueDispatch({ loader: { ...dummies.modalProcess.loading } });
          API.post(
            `buy-services.php?userId=${valueState.basicData.userId}&service=airtime/`,
            values
          )
            .then((res) => {
              if (res.data.status === true) {
                valueDispatch({
                  loader: {
                    ...dummies.modalProcess.success,
                    text: res.data.message,
                  },
                });
                delay(() => {
                  valueDispatch({ loader: { ...dummies.modalProcess.hide } });
                  navigation.navigate("Dashboard");
                }, 2000);
              } else {
                valueDispatch({
                  loader: {
                    ...dummies.modalProcess.error,
                    text: `Internal error: Code[${res.data.message}]`,
                  },
                });
              }
            })
            .catch((error) => {
              valueDispatch({
                loader: { ...dummies.modalProcess.error, text: error.message },
              });
            });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          errors,
          touched,
          values,
        }) => (
          <>
            <View style={{ flex: 1 }}>
              <ScrollViewHeader
                image={image}
                title={`Purchase ${upperFirst(slug)} Airtime`}
                subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
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

      <Loader
        handleRetry={() => formRef.current.handleSubmit()}
        handler={() =>
          valueDispatch({ loader: { ...dummies.modalProcess.hide } })
        }
        props={valueState.loader}
      />

      <VerifyPin
        isVisible={pinScreen}
        closePinScreen={() => setPinScreen(false)}
        action={() => formRef.current.handleSubmit()}
      />
    </View>
  );
};
