import React, { Component } from "react";
import { Dashboard } from "./screens/dashboard";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Airtime } from "./screens/airtime";
import { Data } from "./screens/data";
import { BuyData } from "./screens/buyData";
import { BuyElectricity } from "./screens/buyElectricity";
import { Profile } from "./screens/profile";
import { Service } from "./screens/service";
import { Registration } from "./screens/registration";
import { Signin } from "./screens/Signin";
import { Index } from "./screens";
import { ForgotPassword } from "./screens/forgotPassword";
import { CreatePin } from "./screens/createPin";
import { Logout } from "./screens/logOut";
import { Welcome } from "./screens/welcome";
import { TransacHistory } from "./screens/transactionHistory";
import { BankTransfer } from "./screens/bankTransfer";
import { getData, theme } from "./components/global";
import { Context } from "./components/userContext";

export const Navigations = () => {
    const Stack = createNativeStackNavigator();
    const [dataProfile, setDataProfile] = React.useState([])
    React.useEffect(() => {
      
      getData('basicData').then((res) => {
        setDataProfile(res);
      });
    }, [dataProfile.userId] );
    
    if(!dataProfile.userId) {
      return null;
    }
    
    return (
      
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CreatePin"
          screenOptions={{
            headerStyle: {backgroundColor: theme.colors.primary}
          }}  
        >
          
          <Stack.Screen
            name="CreatePin"
            options={{ title: "Transaction PIN" }}
            component={CreatePin}
            initialParams={{ type: "create", userId: dataProfile.userId}}
          />
          
          <Stack.Screen
            name="Welcome"
            options={{ title: "Welcomme Page", headerShown: false }}
            component={Welcome}
          />
          <Stack.Screen
            name="Index"
            component={Index}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
            initialParams={{ userId: 1 }}
          />
          <Stack.Screen
            name="Airtime"
            component={Airtime}
            options={{ title: "Buy Airtime" }}
            initialParams={{ network: "mtn" }}
          />
          <Stack.Screen
            name="Data"
            component={Data}
            options={{ title: "Data Options" }}
            initialParams={{ network: "mtn", service_code: "sme_data_share" }}
          />
          <Stack.Screen
            name="BuyData"
            options={{ title: "Buy Data" }}
            component={BuyData}
            initialParams={{
              network: "mtn",
              description: "500MB CD",
              amount: "NGN 150",
              product_code: "data_share_1gb",
            }}
          />
          <Stack.Screen
            name="BuyElectricity"
            options={{ title: "Buy Electricity" }}
            component={BuyElectricity}
            initialParams={{
              service: "ibed",
              product_code: "ibedc_prepaid_custom",
              description: "Ibadan Electricity Distibution Company - IBEDC",
            }}
          />
          <Stack.Screen
            name="Profile"
            options={{ title: "Profile settings" }}
            component={Profile}
            initialParams={{ userId: 1 }}
          />
          <Stack.Screen
            name="Service"
            options={{ title: "Service" }}
            component={Service}
            initialParams={{ page: "fundWallet" }}
          />
          <Stack.Screen
            name="Registration"
            options={{ title: "Registrater account" }}
            component={Registration}
            initialParams={{ referer: "admin" }}
          />
          <Stack.Screen
            name="Signin"
            options={{ title: "Sign in" }}
            component={Signin}
          />
          <Stack.Screen
            name="ForgotPassword"
            options={{ title: "Forgot password" }}
            component={ForgotPassword}
          />
          <Stack.Screen
            name="TransactionHistory"
            options={{ title: "Transaction History" }}
            component={TransacHistory}
          />
          <Stack.Screen
            name="BankTransfer"
            options={{ title: "Bank Transfer" }}
            component={BankTransfer}
            initialParams={{ icon: "logout" }}
          />
          <Stack.Screen
            name="Logout"
            options={{ title: "Transaction PIN" }}
            component={Logout}
          />
        </Stack.Navigator>
      </NavigationContainer>
     );
};
