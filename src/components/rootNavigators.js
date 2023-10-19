import React from "react";
import { Dashboard } from "../screens/dashboard";
import { NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BuyAirtime } from "../screens/buyAirtime";
import { ViewServices } from "../screens/viewServices";
import { BuyData } from "../screens/buyData";
import { BuyElectricity } from "../screens/buyElectricity";
import { Settings } from "../screens/settings";
import { Registration } from "../screens/registration";
import { Signin } from "../screens/Signin";
import { CreatePin } from "../screens/createPin";
import { Logout } from "../screens/logOut";
import { Welcome } from "../screens/welcome";
import { TransactionHistory } from "../screens/transactionHistory";
import { BankTransfer } from "../screens/bankTransfer";
import { GoBackIcon, MenuView, theme } from "./global";
import { VerifyPin } from "../screens/verifyPin";
import { UpdateProfile } from "../screens/updateProfile";
import { ViewProducts } from "../screens/viewProducts";
import { BuyBill } from "../screens/buyBill";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createDrawerNavigator} from '@react-navigation/drawer';
import { AutomatedBanks } from "../screens/automatedBanks";
import { FundWallet } from "../screens/fundWallet";
import { MerchantPayment } from "../screens/merchantPayment";
import { WebViewComponent } from "../screens/webView";
import { VerifyOtpPIn } from "../screens/verifyOtpPin";
import { UpgradeAccount } from "../screens/upgradeAccount";
import { UpdatePassword } from "../screens/updatePassword";
import { ForgetPassword } from "../screens/forgetPassword";
import { VerifyOtpPassword } from "../screens/verifyOtpPassword";
import { NewPassword } from "../screens/newPassword";
import { UpdatePin } from "../screens/updatePin";
import { TransferFund } from "../screens/transferFund";

export const RootNavigators = () => {
  const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();
  function BottomHomeTabs() {
    return (
      <Tab.Navigator
        initialRouteName="Dashboard"       
        screenOptions={{
            tabBarLabelStyle: {fontSize: 16},
            tabBarStyle: {
              height: 75, 
              paddingBottom: 5,  
              backgroundColor: theme.colors.primary
            },
            tabBarActiveTintColor: theme.colors.white,
            tabBarInactiveTintColor: theme.colors.dimmer,
            headerShown: false
        }}        
      >
        <Tab.Screen
            name="Dashboard"          
            component={Dashboard}
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={35} />
                ),
            }}
        />        
        <Tab.Screen
            name="FundWallet"
            component={FundWallet}
            options={{
                tabBarLabel: 'Fund Wallet',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="bank-plus" color={color} size={35} />
                ),
            }}
            initialParams={{ slug: "drawer" }}
        />
        <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="cog" color={color} size={35} />
                ),
            }}
            initialParams={{ slug: "drawer" }}
        />
      </Tab.Navigator>
    );
  }

  const Drawer = createDrawerNavigator();
  function MyDrawer() {
    return (
      <Drawer.Navigator
        useLegacyImplementation
        drawerContent={() => <MenuView /> }
      >
        <Drawer.Screen 
          name="BottomHomeTabs" 
          component={BottomHomeTabs} 
          options={{ 
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator            
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTitleStyle: { color: 'white' },
            contentStyle: {backgroundColor: '#fff'},
            headerLeft: () => ( <GoBackIcon /> )
          }}
        >
          
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={MyDrawer}
          />
          
          <Stack.Screen
            name="CreatePin"
            options={{ title: "Create Transaction PIN" }}
            component={CreatePin}
          />
          <Stack.Screen
            name="UpdatePassword"
            options={{ title: "Update password" }}
            component={UpdatePassword}
          />
          <Stack.Screen
            name="ForgetPassword"
            options={{ title: "Reset password" }}
            component={ForgetPassword}
          />
          
          <Stack.Screen
            name="UpgradeAccount"
            options={{ title: "Account Upgrade" }}
            component={UpgradeAccount}
          />
          <Stack.Screen
            name="NewPassword"
            options={{ title: "Create Password" }}
            component={NewPassword}
          />
          
          <Stack.Screen
            name="VerifyOtpPIn"
            options={{ title: "OTP Verification" }}
            component={VerifyOtpPIn}
          />
          
          <Stack.Screen
            name="UpdatePin"
            options={{ title: "Update Pin" }}
            component={UpdatePin}
          />
          
          <Stack.Screen
            name="FundWallet"
            options={{ title: "Fund Wallet" }}
            component={FundWallet}
            initialParams={{ slug: "drawer" }}
          />
          
          <Stack.Screen
            name="VerifyOtpPassword"
            options={{ title: "Verify OTP" }}
            component={VerifyOtpPassword}
            initialParams={{email: 'cafeat9ja@gmail.coms'}}
          />

          <Stack.Screen
            name="VerifyPin"
            options={{ title: "Transaction PIN Verification" }}
            component={VerifyPin}
          />

          <Stack.Screen
            name="Welcome"
            options={{ title: "Welcome Page", headerShown: false }}
            component={Welcome}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AutomatedBanks"
            options={{ title: "Automated Banks" }}
            component={AutomatedBanks}
          />
          <Stack.Screen
            name="WebViewComponent"
            options={{ title: "Web View" }}
            component={WebViewComponent}
            initialParams={{ url: "https://sandbox.sdk.monnify.com/checkout/MNFY%7C33%7C20230625112310%7C001341" }}
          />
          <Stack.Screen
            name="MerchantPayment"
            options={{ title: "Merchant Payment" }}
            component={MerchantPayment}
          />
          <Stack.Screen
            name="ViewServices"
            component={ViewServices}
            options={{ title: "Services Options" }}
          />
          <Stack.Screen
            name="BuyAirtime"
            component={BuyAirtime}
            options={{ title: "Buy Airtime" }}
            initialParams={{
                id: 1,
                api_product_id: 1,
                image: 'image',
                slug: 'airtime',
                amount: 200,
                name: "200 airtime"
            }}
          />
          <Stack.Screen
            name="BuyBill"
            component={BuyBill}
            options={{ title: "Purchase Cable TV" }}
            initialParams={{
              id: 51,
              api_product_id: 7,
              image: 'image',
              slug: 'bill',
              amount: 200,
              name: "200 bill"
            }}
          />
          <Stack.Screen
            name="BuyData"
            component={BuyData}
            options={{ title: "Buy Data" }}
            initialParams={{
              id: 1,
              api_product_id: 7,
              image: 'image',
              slug: 'data',
              amount: 200,
              name: "200 data"
            }}
          />
          <Stack.Screen
            name="BuyElectricity"
            component={BuyElectricity}
            options={{ title: "Buy Electricity" }}
            initialParams={{
              id: 78,
              api_product_id: 7,
              image: 'image',
              slug: 'electricity',
              amount: 200,
              name: "200 electricity"
            }}
          />
          <Stack.Screen
            name="Settings"
            options={{ title: "Profile settings" }}
            component={Settings}
          />
          <Stack.Screen
            name="UpdateProfile"
            options={{ title: "Update profile" }}
            component={UpdateProfile}
          />
          <Stack.Screen
            name="ViewProducts"
            options={{ title: "Available Services" }}
            component={ViewProducts}
          />
          <Stack.Screen
            name="Registration"
            options={{ title: "Register account" }}
            component={Registration}
            initialParams={{ referer: "admin" }}
          />
          <Stack.Screen
            name="Signin"
            options={{ title: "Sign in" }}
            component={Signin}
          />
          <Stack.Screen
            name="TransactionHistory"
            options={{ title: "Transaction History" }}
            component={TransactionHistory}
          />
          <Stack.Screen
            name="TransferFund"
            options={{ title: "Transfer Fund" }}
            component={TransferFund}
          />
          <Stack.Screen
            name="BankTransfer"
            options={{ title: "Bank Transfer" }}
            component={BankTransfer}
            initialParams={{ icon: "logout" }}
          />
          <Stack.Screen
            name="Logout"
            options={{ headerShown: false }}
            component={Logout}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
