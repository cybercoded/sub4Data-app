import React, { Component } from 'react';
import { Dashboard } from './screens/dashboard';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Airtime } from './screens/airtime';
import { Data } from './screens/data';
import { BuyData } from './screens/buyData';
import { BuyElectricity } from './screens/buyElectricity';
import { Profile } from './screens/profile';
import { ElectricityService } from './screens/ElectricityService';
import { Registration } from './screens/registration';
import { Signin } from './screens/Signin';
import { Index } from './screens';
import { ForgotPassword } from './screens/forgotPassword';
import { CreatePin } from './screens/createPin';
import { Logout } from './screens/logOut';
import { Welcome } from './screens/welcome';
import { TransacHistory } from './screens/transactionHistory';
import { BankTransfer } from './screens/bankTransfer';
import { getData, storeData, theme } from './components/global';
import { Context, initialValues } from './components/userContext';
import { VerifyPin } from './screens/verifyPin';
import { UpdateProfile } from './screens/updateProfile';
import { Electricity } from './screens/electricity';
import { AirtimeService } from './screens/airtimeService';
import { SMEDataService } from './screens/SMEDataService';
import { CableService } from './screens/CableService';
import { DirectDataService } from './screens/DirectDataService';
import { Cable } from './screens/cable';
import { BuyCable } from './screens/buyCable';

export const Navigations = () => {
    const Stack = createNativeStackNavigator();
    const { valueState, valueDispatch } = React.useContext(Context);

    React.useEffect(() => {
        getData('basicData').then((res) => {

            storeData('loader', initialValues.loader);

            valueDispatch({ basicData: res });
        });
    }, [valueState.userId]);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.primary }
                }}
            >
                <Stack.Screen name="CreatePin" options={{ title: 'Create Transaction PIN' }} component={CreatePin} />

                <Stack.Screen
                    name="VerifyPin" 
                    options={{ title: 'Transaction PIN Verification' }} 
                    component={VerifyPin} 
                />

                <Stack.Screen name="Welcome" options={{ title: 'Welcomme Page', headerShown: false }} component={Welcome} />
                <Stack.Screen name="Index" component={Index} options={{ headerShown: false }} />
                <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} initialParams={{ userId: 1 }} />
                <Stack.Screen name="Airtime" component={Airtime} options={{ title: 'Buy Airtime' }} initialParams={{ network: 'mtn' }} />
                <Stack.Screen
                    name="Data"
                    component={Data}
                    options={{ title: 'Data Options' }}
                />
                <Stack.Screen
                    name="Cable"
                    component={Cable}
                    options={{ title: 'Cable TV Options' }}
                />
                <Stack.Screen
                    name="BuyCable"
                    component={BuyCable}
                    options={{ title: 'Purchase Cable TV' }}
                />
                <Stack.Screen
                    name="BuyData"
                    options={{ title: 'Buy Data' }}
                    component={BuyData}
                />
                <Stack.Screen 
                    name="BuyElectricity" 
                    options={{ title: 'Buy Electricity' }} 
                    component={BuyElectricity} 
                />
                <Stack.Screen 
                    name="Electricity" 
                    options={{ title: ' Electricity' }} 
                    component={Electricity}
                />
                <Stack.Screen 
                    name="Profile" 
                    options={{ title: 'Profile settings' }} 
                    component={Profile}
                />
                <Stack.Screen 
                    name="UpdateProfile" 
                    options={{ title: 'Update profile' }} 
                    component={UpdateProfile} 
                />
                <Stack.Screen 
                    name="ElectricityService" 
                    options={{ title: 'ElectricityService' }} 
                    component={ElectricityService} 
                />
                <Stack.Screen 
                    name="AirtimeService" 
                    options={{ title: 'Airtime Services' }} 
                    component={AirtimeService} 
                />
                <Stack.Screen 
                    name="SMEDataService" 
                    options={{ title: 'SME Data Services' }} 
                    component={SMEDataService} 
                />
                <Stack.Screen 
                    name="DirectDataService" 
                    options={{ title: 'Direct Data Services' }} 
                    component={DirectDataService} 
                />
                <Stack.Screen 
                    name="CableService"  
                    options={{ title: 'Cable TV Services' }} 
                    component={CableService} 
                />
                <Stack.Screen
                    name="Registration"
                    options={{ title: 'Registrater account' }}
                    component={Registration}
                    initialParams={{ referer: 'admin' }}
                />
                <Stack.Screen name="Signin" options={{ title: 'Sign in' }} component={Signin} />
                <Stack.Screen name="ForgotPassword" options={{ title: 'Forgot password' }} component={ForgotPassword} />
                <Stack.Screen name="TransactionHistory" options={{ title: 'Transaction History' }} component={TransacHistory} />
                <Stack.Screen
                    name="BankTransfer"
                    options={{ title: 'Bank Transfer' }}
                    component={BankTransfer}
                    initialParams={{ icon: 'logout' }}
                />
                <Stack.Screen name="Logout" options={{ title: 'Transaction PIN' }} component={Logout} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
