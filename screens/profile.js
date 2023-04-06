import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import { Avatar, Button, Icon, Input, ListItem } from 'react-native-elements';
import { API, Loader, storeData, styles, theme } from '../components/global';
import { Formik } from 'formik';
import * as yup from "yup";
import { Context } from '../components/userContext';
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';

export const Profile = ({navigation}) => {

    const {valueState, valueDispatch} = React.useContext(Context);

    const settingList = [
        {
            icon: 'account-circle', 
            title: 'Basic Information', 
            subtitle: 'Manage and update your personal information',
            page: 'UpdateProfile',
        },
        {
            icon: 'account-circle', 
            title: 'Basic Information', 
            subtitle: 'Manage and update your personal information',
            page: 'UpdateProfile',
        },
        {
            icon: 'account-circle', 
            title: 'Basic Information', 
            subtitle: 'Manage and update your personal information',
            page: 'UpdateProfile',
        },
    ]

    return (
        <View style={styles.container}>
            <View style={{flex: 1, width: '100%'}}>
                {  settingList.map((item, i) => (
                    <ListItem
                        key={i}
                        Component={TouchableOpacity}
                        bottomDivider={true}
                        onPress={() => navigation.navigate(item.page)}
                    >
                        <Icon name={item.icon} type="material-community" size={50} color="grey" />
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                            <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron size={40}/>
                    </ListItem>
                )) }
            </View>
        </View>
    )
};