import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, View, ScrollView } from "react-native";
import { Formik } from "formik";
import {
  API,
  getData,
  Loader,
  storeData,
  styles,
  theme,
} from "../components/global";
import { Button, Icon, Input, Switch, Text } from "react-native-elements";
import * as yup from "yup";
import { Context } from "../components/userContext";

export const Registration = ({ navigation }) => {

  const {valueState, valueDispatch} = React.useContext(Context);

  const [passwordVisibility, setPasswordVisibility] = React.useState(true);
  const [loader, setLoader] = useState({
    visible: false,
    icon: "loader", //'highlight-off' 'check-circle-outline',
    text: "Please wait",
    actions: true,
    color: theme.colors.primary,
  });
  const [isReferred, setIsReferred] = React.useState(false);

  const toggleModal = () => {
    setLoader((previous) => ({ ...loader, visible: !loader.visible }));
  };

  React.useEffect(() => {
    getData('localURL').then((data) => {
      console.log(JSON.stringify(data));
    })
  }, [])

  return (
    <View style={styles.centerContainer}>
      <ScrollView style={{ width: "100%" }}>
        <View style={{ marginVertical: 20, alignItems: "center" }}>
          <Image
            style={{ height: 100, width: 100 }}
            source={require("../assets/icon.png")}
          />
          <Text style={{ marginVertical: 10 }}>
            Create free account on Tommytop
          </Text>
        </View>

        <Formik
            initialValues={{
            fullNames: 'Oluwadare Tomiwa Kunle',
            email: 'cafeat9ja@gmail.coms',
            phoneNumber: '09036989565',
            password: 'password',
            referer: 'cafeat9ja@gmail.com', 
          
            /* fullNames: "",
            email: "",
            phoneNumber: "",
            password: "",
            referer: "", */
          }}
          validateOnChange={false}
          validationSchema={yup.object().shape({
            fullNames: yup
              .string()
              .required("Enter your full names")
              .min(7, "Min of 7 characters is required!")
              .max(30, "Max of 30 characters is required!"),
            phoneNumber: yup
              .string()
              .required("Enter your phone number")
              .min(11, "Enter 11 digits fornat Nigerian phone number!")
              .max(11, "Enter 11 digits fornat Nigerian phone number!"),
            email: yup
              .string()
              .email("Invalid email")
              .required("Enter your email address")
              .test(
                "Unique Email",
                "Email already in use", // <- key, message
                function (value) {
                  return new Promise((resolve, reject) => {
                    API.post(`check-email.php`, { email: value }).then(
                      (res) => {
                        if (res.data === true) {
                          resolve(true);
                        } else {
                          resolve(false);
                        }
                      }
                    );
                  });
                }
              ),
            password: yup
              .string()
              .required("Enter your passsword")
              .matches(
                /^[a-zA-Z0-9_+-]{5,15}$/,
                `Should be 5-15 characters, lowercase, uppercase or numbers and [_, -, +] characters`
              ),
            referer: yup
              .string()
              .email("Invalid referer' email")
              .test(
                "Unique referer",
                "Referer not found", // <- key, message
                function (value) {
                  return new Promise((resolve, reject) => {
                    API.post(`check-email.php`, { email: value }).then(
                      (res) => {
                        if (!isReferred) {
                          resolve(true);
                        } else {
                          if (res.data === false) {
                            resolve(true);
                          } else {
                            resolve(false);
                          }
                        }
                      }
                    );
                  });
                }
              ),
          })}
          onSubmit={(values) => {
            toggleModal();
            API.post(`register.php`, values)
              .then((res) => {
                if (!isNaN(res.data)) {
                  setLoader({
                    ...loader,
                    visible: true,
                    actions: false,
                    icon: "check-circle-outline",
                    color: theme.colors.primary,
                    text: "Registration Successful, please wait a minute to be redirected",
                  });
                  API.get(`getdata.php?userId=${res.data}`).then((res) => {
                    
                    if ( res.data.status === true ) {
                      valueDispatch({basicData: res.data.data});
                      storeData("basicData", res.data.data);
                      storeData("isLoggedIn", true);
                      setLoader({...loader, visible: false})                     
                      navigation.navigate("Dashboard", {
                        userId: res.data.data.userId
                      });
                     }
                  });
                } else {
                  setLoader({
                    ...loader,
                    visible: true,
                    icon: "highlight-off",
                    color: "red",
                    actions: true,
                    text: "Something went wrong",
                  });
                }
              })
              .catch((err) => {
                setLoader({
                  ...loader,
                  visible: true,
                  icon: "highlight-off",
                  color: "red",
                  actions: true,
                  text: err.message,
                });
                console.error(err.message);
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
              
                <Loader
                  submittion={handleSubmit}
                  handler={toggleModal}
                  props={loader}
                />
              <Input
                placeholder="Full names"
                inputContainerStyle={styles.input}
                containerStyle={{ paddingHorizontal: 0 }}
                onChangeText={handleChange("fullNames")}
                onBlur={handleBlur("fullNames")}
                value={values.fullNames}
                errorMessage={
                  errors.fullNames && touched.fullNames && errors.fullNames
                }
              />
              <Input
                placeholder="Email address"
                inputContainerStyle={styles.input}
                containerStyle={{ paddingHorizontal: 0 }}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                errorMessage={errors.email && touched.email && errors.email}
              />
              <Input
                placeholder="Phone number"
                inputContainerStyle={styles.input}
                containerStyle={{ paddingHorizontal: 0 }}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                value={values.phoneNumber}
                errorMessage={
                  errors.phoneNumber &&
                  touched.phoneNumber &&
                  errors.phoneNumber
                }
              />
              <Input
                placeholder="Password"
                inputContainerStyle={styles.input}
                containerStyle={{ paddingHorizontal: 0 }}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={passwordVisibility}
                rightIcon={
                  <Icon
                    name={passwordVisibility ? "visibility" : "visibility-off"}
                    size={35}
                    color={theme.colors.gray}
                    onPress={() => setPasswordVisibility(!passwordVisibility)}
                  />
                }
                errorMessage={
                  errors.password && touched.password && errors.password
                }
              />

              <View style={{ width: "100%" }}>
                <View style={{ flex: 1, flexDirection: "row", flexWrap: 'wrap' }}>
                  <Text
                    style={{
                      marginRight: 20,
                      marginTop: 12,
                      color: theme.colors.primary,
                    }}
                  >
                    I was {isReferred && "not"} referred
                  </Text>
                  <Switch
                    color={theme.colors.primary}
                    value={isReferred}
                    onValueChange={() => setIsReferred(!isReferred)}
                  />
                </View>
              </View>

              {isReferred && (
                <Input
                  placeholder="Enter the email of who referred you"
                  inputContainerStyle={styles.input}
                  containerStyle={{ paddingHorizontal: 0 }}
                    onChangeText={handleChange("referer")}
                  onBlur={handleBlur("referer")}
                  value={values.referer}
                  placeholderTextColor={theme.colors.primary}
                  errorMessage={
                    errors.referer && touched.referer && errors.referer
                  }
                />
              )}

              <View
                style={{ flex: 1, alignItems: "center", marginTop: 20 }}
              >
                <Text
                  style={{
                    width: "70%",
                    textAlign: "center",
                  }}
                >
                  By continuing it means you accept all our terms and
                  conditions.
                </Text>
              </View>

              <Button
                onPress={handleSubmit}
                title="Create free account"
                buttonStyle={[styles.button, { marginBottom: 0 }]}
              />
              <View style={{ flex: 1, alignItems: "center" }}>
                <View style={styles.rowFlex}>
                  <Text>already have an account?</Text>
                  <Pressable
                    onPress={() => navigation.navigate("Signin")}
                    style={{ marginLeft: 10 }}
                  >
                    <Text
                      style={{
                        color: theme.colors.primary,
                        }}
                    >
                      Sign in
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};
