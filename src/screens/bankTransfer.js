import {
    View,
    Text,
  } from "react-native";
  import React from "react";
  import {
    styles,
    theme,
  } from "../components/global";
  import { Icon } from "react-native-elements";
  
  export const BankTransfer = ({ route, navigation }) => {
    
    const { icon } = route.params;

    return (
      <View style={styles.centerContainer}>
        <View style={{ marginVertical: 30, alignItems: "center" }}>
            <Icon
                color={theme.colors.primary}
                size={80}
                name={icon}
            />
          <Text style={{ marginVertical: 10, fontSize: 700 }}>
            Fund wallet with card
          </Text>
          <Text style={{ marginVertical: 10, textAlign: 'center' }}>
            It's easy, just provide your card details you will receive an OTP in your email or phone number linked with your bank account
          </Text>
          <Text style={{ fontSize: 100 }}>Wallet Balance = 0.0</Text>
        </View>
      </View>
    );
  };
  