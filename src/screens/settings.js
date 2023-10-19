import { TouchableOpacity, View, ScrollView } from 'react-native'
import React from 'react'
import {Icon, ListItem, Text } from 'react-native-elements';
import { getData, styles, theme } from '../components/global';

export const Settings = ({route, navigation}) => {

    const { slug } = route.params;
    const [currentPin, setCurrentPin] = React.useState()
    const settingList = [
        {
            icon: 'account-outline', 
            title: 'Basic Information', 
            subtitle: 'Manage and update your personal information',
            page: 'UpdateProfile',
        },
        {
            icon: 'lock-alert-outline', 
            title: 'Create Transaction PIN', 
            subtitle: 'Create new Transaction PIN',
            page: 'CreatePin',
        },
        {
            icon: 'lock-open-outline', 
            title: 'Update Transaction PIN', 
            subtitle: 'Manage your Transaction PIN',
            page: 'UpdatePin',
        },
        {
            icon: 'lock-off-outline', 
            title: 'Update Password', 
            subtitle: 'Update your account password for security of your account',
            page: 'UpdatePassword',
        },
        {
            icon: 'account-star', 
            title: 'Account Upgrade ', 
            subtitle: 'Upgrade your account for higher discount and less charges',
            page: 'UpgradeAccount',
        },
        { 
            icon: "logout",
            title: "Logout account",
            subtitle: 'Logout my account from this device',
            page: "Logout" 
        },
        { 
            icon: "information-outline",
            title: "App Version",
            subtitle: 'Version 1.0.0',
            page: "Settings" 
        }
    ];

    getData('basicData').then((res) => {
        setCurrentPin(res.pin)
    });

    return (
        <>
            { slug === "drawer" &&
                <View
                        style={{
                            backgroundColor: theme.colors.primary,
                            padding: 10,
                            width: '100%'
                        }}
                    >
                        <View style={[styles.rowFlex, {justifyContent: 'flex-start'}]}>
                            <Icon name="keyboard-backspace" style={{marginLeft: 20}} color={theme.colors.white} size={40} onPress={() => navigation.goBack(null) } />
                            <Text h4 h4Style={{color: theme.colors.white, marginStart: 10}}>Settings</Text>
                        </View>
                </View>
            }
            <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
                <ScrollView style={{ width: '90%'}}>
                    {  settingList.map((item, i) => {
                        if (item.page == "CreatePin" && currentPin != null) {
                            return;   
                        }
                        return (
                            <ListItem
                                key={i}
                                Component={TouchableOpacity}
                                bottomDivider={true}
                                containerStyle={styles.productListStyle}
                                onPress={() => navigation.navigate(item.page)}
                            >
                                <Icon name={item.icon} type="material-community" size={40} color="grey" />
                                <ListItem.Content>
                                    <ListItem.Title>{item.title}</ListItem.Title>
                                    <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron size={40}/>
                            </ListItem>
                        )
                    }) }
                </ScrollView>
            </View>
        </>
    );
};