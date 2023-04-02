import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import React from "react";
import { API, BASE_URL, Loader, PinVerifyPad, styles, theme } from "../components/global";
import {
  Button,
  Input,
  Switch,
} from "react-native-elements";
import { Context } from "../components/userContext";
import { Formik } from "formik";
import { dummies } from "../components/dummies";
import delay from "lodash";

export const BuyElectricity = ({ route, navigation }) => {
  const { service, description, product_code } = route.params;
  const [value, setValue] = React.useState(false);
  const [bottomModal, setBottomModal] = React.useState(false);
  const [pinInputText, setPinInputText] = React.useState("");
  const [pinPadDisability, setPinPadDisability] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = React.useState(false);
  const { valueState, valueDispatch } = React.useContext(Context);

  const pinInput = (val) => {
    if (pinInputText.length == 4) {
      setPinPadDisability(true);
    } else {
      setPinInputText(`${pinInputText}${val}`);
    }
  };

  const purchaseHandler = (wholeValues) => {
    const {task, ...values} = wholeValues;

    valueDispatch({
        loader: { ...dummies.modalProcess.loading },
    });
    API.post(`buy-services.php?userId=${valueState.basicData.userId}&service=electric`, values)
    .then((res) => {
      if (res.data.status === true) {
        valueDispatch({
          loader: {
            ...dummies.modalProcess.success,
            text: <Text style={{fontSize: 700}}>{res.data.message}</Text> 
          },
        });
        delay(()=> {
          navigation.navigate('Dashboard');
        }, 5000)
      }else {
        valueDispatch({
          loader: {
            ...dummies.modalProcess.error,
            text: <View>
                    <View>
                      <Text style={{fontSize: 700}}>{res.data.message}</Text> 
                    </View>
                    <Text> please try again!</Text>
                  </View>
          },
        });
      }
    })
  };

  const verifyPinHandler = (values) => {
    setBottomModal(true);
    valueDispatch({
      loader: { ...dummies.modalProcess.loading },
    });
    API.post(`check-pin.php?userId=${valueState.basicData.userId}`, {
      pin: pinInputText,
    }).then((res) => {
      if (res.data.status) {
        valueDispatch({
          loader: {
            ...dummies.modalProcess.success,
            text: (
              <View>
                <View>
                  <Text style={{ fontSize: 700 }}>{res.data.message}</Text>
                </View>
                <Text> please wait while we process your purchace</Text>
              </View>
            ),
            icon: "loader",
          },
        });

        API.post(`get-sub-services.php?userId=${valueState.basicData?.userId}&service=electric`, values)
        .then((res) => {
          if (res.data.status === true) {
            console.log(res.data.data)
            valueDispatch({
              loader: {
                ...dummies.modalProcess.success,
                text: (
                  <View>
                    <View>
                      <Text style={{ fontSize: 700 }}>
                        {res.data.message}
                      </Text>
                    </View>
                    {Object.entries(res.data.data).map(([key, value]) => {
                        return(
                            <View style={[styles.colomnFlex, {alignItems: 'flex-start', marginBottom: 10}]}>
                                <View>
                                    <Text style={{fontSize: 700}}>{key.toUpperCase()}:</Text>
                                </View>
                                <View style={{
                                    paddingHorizontal: 5,
                                    backgroundColor: theme.colors.dim,
                                    paddingVertical: 15,
                                    width: '100%',
                                    alignItems: 'flex-start',
                                }}>
                                    <Text style={{textAlign: 'left'}}>{value}</Text>
                                </View>                                
                            </View>
                        );
                    })}
                    <Button onPress={() => purchaseHandler(values) } title='Purchase now' />
                  </View>
                ),
              },
            });

            delay(() => {
              navigation.navigate("Dashboard");
            }, 5000);
          } else {
            valueDispatch({
              loader: {
                ...dummies.modalProcess.error,
                text: (
                  <View>
                    <View>
                      <Text style={{ fontSize: 700 }}>
                        {res.data.message}
                      </Text>
                    </View>
                    <Text> please try again!</Text>
                  </View>
                ),
              },
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
                  <Text style={{ fontSize: 700 }}>{res.data.message}</Text>
                </View>
                <Text> please try again!</Text>
              </View>
            ),
          },
        });
      }
    });
  };

  return (
    <View style={styles.centerContainer}>
      <View style={{ marginVertical: 20, alignItems: "center" }}>
        <Image
          style={{ height: 100, width: 100 }}
          source={{ uri: `${BASE_URL}img/${service}-img.jpg` }}
        />
        <Text style={{ marginVertical: 10 }}>{description}</Text>
        <Text>Wallet Balance = {valueState.basicData?.balance}</Text>
      </View>
      <Formik
        initialValues={{
          meter_number: "62141331165",
          product_code: product_code,
          task: 'verify',
          amount: 100
        }}
        onSubmit={(values) => {
          verifyPinHandler(values);
        }}
      >
        {({ handleSubmit, values }) => (
          <View style={{ width: "100%" }}>
            <Input
              placeholder="Meter number"
              inputContainerStyle={styles.input}
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{ outline: 0 }}
              value={values.meter_number}
            />

            <Input
              placeholder="Amount"
              inputContainerStyle={styles.input}
              containerStyle={{ paddingHorizontal: 0 }}
              inputStyle={{ outline: 0 }}
              value={values.amount}
            />

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
                <Button title="Select from phone" type="outline" />
              </View>
            </View>

            <Button
              title="Verify my meter number"
              onPress={() => setBottomModal(true) }
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

            <Modal
              animationType="slide"
              transparent={true}
              visible={bottomModal}
            >
              <TouchableOpacity
                style={styles.bottomModalCenteredView}
                onPress={() => setBottomModal(false)}
              >
                <TouchableOpacity
                  style={styles.bottomModalView}
                  activeOpacity={1}
                >
                  <PinVerifyPad
                    allProps={{
                      handleSubmit: handleSubmit,
                      setPinInputText: setPinInputText,
                      pinInput: pinInput,
                      pinInputText: pinInputText,
                      pinPadDisability: pinPadDisability,
                      setPinPadDisability: setPinPadDisability,
                    }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
      </Formik>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
      >
        <TouchableOpacity
          style={styles.modalCenteredView}
          onPress={() => setCategoryModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalView} activeOpacity={1}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Image
                style={{ width: 80, height: 70 }}
                source={{ uri: `${BASE_URL}img/${service}-img.jpg` }}
              />
              <Text style={{ textAlign: "center", marginVertical: 20 }}>
                {description}
              </Text>
              <Button
                onPress={() => setCategoryModalVisible(false)}
                type="outline"
                title="Prepaid"
                buttonStyle={[
                  styles.button,
                  { backgroundColor: "none", borderWidth: 1 },
                ]}
                containerStyle={{ width: "100%", marginBottom: 10 }}
              />
              <Button
                onPress={() => setCategoryModalVisible(false)}
                type="outline"
                title="Postpaid"
                buttonStyle={[
                  styles.button,
                  { backgroundColor: "none", borderWidth: 1 },
                ]}
                containerStyle={{ width: "100%" }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        visible={valueState.loader.visibile}
        transparent={true}
      >
        <Loader
          submittion={verifyPinHandler}
          handler={() =>
            valueDispatch({ loader: { ...valueState.loader, visibile: false } })
          }
          props={valueState.loader}
        />
      </Modal>
    </View>
  );
};
