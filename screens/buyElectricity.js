import {
    View,
    ScrollView
  } from "react-native";
  import React from "react";
  import { API, Loader, PinVerifyPad, ScrollViewHeader, styles, theme } from "../components/global";
  import {
    Button,
    Divider,
    Icon,
    Input,
    ListItem,
    Overlay,
    Switch,
  } from "react-native-elements";
  import { Context } from "../components/userContext";
  import { Formik } from "formik";
  import { dummies } from "../components/dummies";
  import delay from "lodash/delay";
  import * as yup from "yup";
  
  export const BuyElectricity = ({ route, navigation }) => {
    const { sub_service_name, task, meter_number, available_service_logo, product_code, isPinVerified } = route.params;
    const { valueState, valueDispatch } = React.useContext(Context);
    const [userDetails, setUserDetails] = React.useState([]);
    const formRef = React.useRef();
  
  
    React.useEffect(() => {
      console.log(isPinVerified)
      if( isPinVerified && formRef.current) {
        formRef.current.handleSubmit()
  
        return;
      }
      
      valueDispatch({loader: { ...dummies.modalProcess.loading }});
      API.post(`meter-number-verify.php?userId=1&service=electric/`, {
        meter_number: meter_number,
        product_code: product_code,
        task: task
      })
      .then((res) => {
        if (res.data.status === true) {
          setUserDetails(res.data.data);
          valueDispatch({loader: { ...dummies.modalProcess.hide }});
        }else {
          valueDispatch({ loader: {
              ...dummies.modalProcess.error,
              title: res.data.message,
              text: 'please try again!'
            }
          });
        }
      })
      .catch((error) => {
        valueDispatch({loader: { ...dummies.modalProcess.error, text: error.message } });
      })
    }, [isPinVerified]);
  
    return (
      <>
        <View style={styles.container}>
          <View style={{flex: 2}}>
            <ScrollViewHeader
                image={{uri: available_service_logo}}
                title={`Purchase ${sub_service_name.toUpperCase()}`}
                subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
            />
          </View>
         
          <View style={{flex: 4, width: '100%'}}>
            <ScrollView>
              <Formik
                innerRef={formRef}
                initialValues={{
                  meter_number: meter_number,
                  task: task,
                  product_code: product_code
                }}
                validationSchema={yup.object().shape({
                  meter_number: yup
                      .string()
                      .required("Enter your your card number")
                      .min(11, "Enter 11 digits!")
                      .max(11, "Enter 11 digits!"),
                  product_code: yup
                    .string()
                    .required("Please secelect a product")
                })}
                onSubmit={(values) => {
                    valueDispatch({loader: { ...dummies.modalProcess.loading }});
                    API.post(`buy-services.php?userId=${valueState.basicData.userId}&service=electric/`, {
                      product_code: product_code,
                      meter_number: meter_number,
                      amount: 100
                    })
                    .then((res) => {
                      if (res.data.status === true) {
                        valueDispatch({ loader: {
                            ...dummies.modalProcess.success,
                            text: res.data.message
                          }
                        });
                        delay(()=> {
                          valueDispatch({loader: { ...dummies.modalProcess.hide }});
                          navigation.navigate('Dashboard');
                        }, 5000)
                      }else {
                        valueDispatch({
                          loader: {
                            ...dummies.modalProcess.error,
                            title: res.data.message,
                            text: 'please try again!'
                          },
                        });
                      }
                    })
                    .catch((error) => {
                      valueDispatch({loader: { ...dummies.modalProcess.error, text: error.message } });
                    })
                }}
              >
                {({ handleSubmit, handleChange, handleBlur, setFieldValue, values }) => (
                  <>
                    {
                      Object.entries(userDetails)
                      .filter(([key]) => !['phone', 'number', 'text_status'].includes(key) )
                      .map(([key, value], index) =>
                        <Input
                          key={index}
                          multiline={true}
                          inputContainerStyle={[styles.input, {paddingVertical: 7, margin: 0}]}
                          containerStyle={{margin: 0}}     
                          label={key}
                          value={value}
                          disabled={true}
                        />
                      )
                    }
                    <Button
                      title="Purchace now"
                      onPress={() => navigation.navigate('VerifyPin', {...route.params, landingPage: 'BuyElectricity'})}
                      buttonStyle={styles.button}
                      containerStyle={{marginTop: 20}}
                    />
                  </>
                )}
              </Formik>
            </ScrollView>
          </View>
        </View>
  
        <Loader
          props={valueState.loader}
          handler={() => valueDispatch({loader: {...dummies.modalProcess.hide}})}
        />
      </>
    );
};