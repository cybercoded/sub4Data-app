import { FlatList, TouchableOpacity, View } from "react-native";
import React from "react";
import { styles, theme, ScrollViewHeader, getData, SearchHighlighter } from "../components/global";
import { Button, Input, ListItem, Text } from "react-native-elements";
import { Formik } from "formik";
import * as yup from "yup";
import delay from "lodash/delay";
import upperFirst from "lodash/upperFirst";
import { VerifyPin } from "./verifyPin";
import { closeAlert, showAlert } from "react-native-customisable-alert";
import axios from "axios";
import Beneficiaries from "../components/beneficiaries";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import isArray from "lodash/isArray";

export const BuyAirtime = ({ route, navigation }) => {
  const { api_product_id, id, image, slug } = route.params;
  const [pinScreen, setPinScreen] = React.useState(false);
  const formRef = React.useRef();
  const [userData, setUserData] = React.useState([]);
  const [beneficiaries, setBeneficiaries] = React.useState([]);
  const [filterSearch, setFilterSearch] = React.useState([]);

  const deleteBeneficiary = (id) => {
    axios.delete(`delete-beneficiary/${id}/${slug}`).then((res) => {
      setBeneficiaries(res.data.beneficiaries);
    });
  };

  React.useEffect(() => {
    getData("basicData").then((res) => {
      setUserData(res);
    });

    axios.get(`get-beneficiaries/${slug}`).then((res) => {
      setBeneficiaries(res.data.beneficiaries);
    });

  }, []);

  return (
    <View style={styles.centerContainer}>
      <View style={{ flex: 2 }}>
        <ScrollViewHeader
          image={image}
          title={`Purchase ${upperFirst(slug)} Airtime`}
          subTitle={`Wallet Balance = ${new Intl.NumberFormat().format(userData.balance)}`}
        />
      </View>

      <View style={{ flex: 6, width: "100%" }}>
        <Formik
          innerRef={formRef}
          initialValues={{
            amount: "",
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
                showAlert({
                  alertType: "success",
                  title: "Success",
                  message: res.data.message,
                });
                delay(() => {
                  closeAlert();
                  navigation.navigate("Home");
                }, 2000);
              } else {
                showAlert({
                  alertType: "error",
                  title: "Error",
                  message: `Internal error: Code[${res.data.message}]`,
                });
              }
            });
          }}
        >
          {({
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            isValid,
            errors,
            touched,
            values,
          }) => (
            <>
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
                  placeholder="Beneficiary phone number"
                  value={values.phone}
                  inputContainerStyle={styles.input}
                  rightIcon={<MaterialCommunityIcons name="contacts" size={40} color={theme.colors.primary} />}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  onFocus={() => {
                    const filterSearch = beneficiaries.filter((item, index) => item.number.includes(values.phone));
                    if(isArray(filterSearch)) {
                      setFilterSearch(filterSearch);
                    } else {
                      setFilterSearch(beneficiaries)
                    }
                  }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  errorMessage={errors.phone && touched.phone && errors.phone}
                />

                <View>
                  { (isArray(filterSearch) && values.phone.length > 0) && (
                    <FlatList
                      data={filterSearch}                            
                      renderItem={({ item, index }) => (
                          <ListItem
                              key={index}
                              Component={TouchableOpacity}
                              bottomDivider={true}
                              containerStyle={styles.productListStyle}
                              onPress={() => {
                                setFieldValue('phone', item.number);
                                setFilterSearch([])
                              }}
                          >
                              <ListItem.Content>                              
                                  <ListItem.Title>
                                    <SearchHighlighter values={item.number} value={values.phone} />
                                  </ListItem.Title>
                                  <ListItem.Subtitle>{item.name}</ListItem.Subtitle>
                              </ListItem.Content>
                              <MaterialCommunityIcons 
                                size={30} 
                                color={theme.colors.dim} 
                                name="delete" 
                                onPress={() => deleteBeneficiary(item.id)} 
                              />
                          </ListItem>
                      )}
                    />
                  )}
                  <Beneficiaries
                    values={values}
                    setFieldValue={setFieldValue}
                    entity='phone'
                  />
                </View>

                <Button
                  title={pinScreen ? "Purchase now" : "Verify Transaction PIN"}
                  onPress={() => setPinScreen(true)}
                  disabled={!isValid}
                  buttonStyle={styles.button}
                  containerStyle={{ marginTop: 20 }}
                />
              </>
          )}
        </Formik>
      </View>
      <VerifyPin
        isVisible={pinScreen}
        closePinScreen={() => setPinScreen(false)}
        action={() => formRef.current.handleSubmit()}
        navigation={navigation}
      />
    </View>
  );
};
