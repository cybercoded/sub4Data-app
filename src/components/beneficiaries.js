import { Formik } from "formik";
import React from "react";
import { View } from "react-native";
import { closeAlert, showAlert } from "react-native-customisable-alert";
import { Text, Switch, Input, Button, Icon } from "react-native-elements";
import { styles, theme } from "./global";
import axios from "axios";
import * as yup from "yup";

const Beneficiaries = ({values, setFieldValue, entity}) => (
    <View style={[styles.rowFlex, styles.input, {marginVertical: 20}]}>
      <View style={{ flex: 1 }}>
        <Text>Save to beneficiary</Text>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Switch
          color={theme.colors.primary}
          value={values.saveBeneficiary}
          onValueChange={() => {
            
            setFieldValue('saveBeneficiary', !values.saveBeneficiary);

            !values.saveBeneficiary && (
              showAlert({
                alertType: 'custom', 
                customAlert: 
                (<View style={{padding: 20, width: '90%', backgroundColor: '#fff', borderRadius: 10}}>
                    <Formik
                      initialValues={{beneficiaryName: ''}}
                      validateOnMount={true}
                      validationSchema={yup.object().shape({
                        beneficiaryName: yup
                        .string()
                        .required(`Enter your ${entity} number`)
                      })}
                      onSubmit={(beneficiary) => {
                        closeAlert();
                        setFieldValue('beneficiaryName', beneficiary.beneficiaryName)
                        setFieldValue('number', values[entity])
                      }}
                    >
                    {({ handleChange, handleBlur, handleSubmit, isValid, errors, touched, values }) => (
                      <>
                        <Input
                          label="Enter name of this beneficiary"
                          placeholder="Beneficiary name"
                          value={values.beneficiaryName}
                          inputContainerStyle={styles.input}
                          onChangeText={handleChange("beneficiaryName")}
                          onBlur={handleBlur("beneficiaryName")}
                          containerStyle={{ paddingHorizontal: 0 }}
                          errorMessage={errors.beneficiaryName && touched.beneficiaryName && errors.beneficiaryName}
                        />

                        <View style={[styles.rowFlex, {justifyContent: 'flex-end', marginTop: 20}]}>
                            <Button
                                title="Cancel"
                                type="outline"
                                onPress={() => {
                                  closeAlert();
                                  setFieldValue('saveBeneficiary', false);
                                }}
                                style={{marginRight: 10}}
                            />
                            <Button
                                title="Save beneficiary"
                                disabled={!isValid}
                                onPress={handleSubmit}
                            />
                        </View>
                      </>
                    )}
                    </Formik>
                </View>)
              })
            );                        
          }}
        />
      </View>
    </View>
);

export default Beneficiaries;