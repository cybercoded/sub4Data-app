import { Alert, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {Button, Icon, ListItem } from 'react-native-elements';
import { getData, storeData, styles, theme } from '../components/global';
import delay from 'lodash/delay';
import { closeAlert, showAlert } from 'react-native-customisable-alert';
import axios from "axios";

export const UpgradeAccount = ({route, navigation}) => {
    const [levelLists, setLevelLists] = React.useState([]);
    const [currentLevel, setCurrentLevel] = React.useState();
    const [selectedLevel, setSelectedLevel] = React.useState();

    React.useEffect(() => {
        axios.get(`view-levels`).then((res) => {
            if (res.data.status === 200) {
                setLevelLists(res.data.levels);
            } else {
                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors });
            }            
        });

        getData('basicData').then((res) => {
            setCurrentLevel(res.level)
        });
    }, []);

    const handleUpgrade = () => {
        closeAlert();
        axios.post(`upgrade-user`, {level: selectedLevel}).then((res) => {
            if ( res.data.status === 200 ) {
                showAlert({alertType: 'success' , title: 'Success', message:  res.data.message+', please wait to be refreshed'});
                axios.get(`get-user`).then((res) => {
                    if ( res.data.status === 200) {                                       
                        storeData('basicData', {...res.data.data});
                        showAlert({alertType: 'success' , title: 'Success', message:  res.data.message});                                
                        delay(() => {
                            closeAlert();
                            navigation.navigate('Home');
                        }, 2000);                                
                    }
                });
            } else {
                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
            }
        });
    };

    return (
        <>
            <View style={{flex: 10, alignItems: 'center', backgroundColor: theme.colors.white}}>
                <View style={{ width: '90%'}}>
                    {  levelLists.map((item, i) => (
                        <ListItem
                            key={i}
                            disabled={currentLevel >= item.level}
                            Component={TouchableOpacity}
                            onPress={() => {
                                if (currentLevel < item.level) {
                                    setSelectedLevel(item.level)
                                }
                            }}
                            containerStyle={[styles.productListStyle, {
                                    marginVertical: 10,
                                    borderColor: selectedLevel === item.level && theme.colors.primary,
                                    borderWidth: selectedLevel === item.level && 2,
                                    backgroundColor: currentLevel >= item.level && theme.colors.dimmer
                            }]}
                        >
                            <Icon name={item.icon} type="material-community" size={50} color="grey" />
                            <ListItem.Content>
                                <ListItem.Title>{item.name}</ListItem.Title>
                                <ListItem.Subtitle>Upgrade with ₦{item.upgrade_fee} and enjoy ₦{item.percentage}% on every transactions </ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron size={40}/>
                        </ListItem>
                    )) }
                </View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <View style={{ width: '90%'}}>
                    <Button onPress={() => {
                       showAlert({
                            alertType: 'warning' , 
                            title: 'Are you sure', 
                            message: 'Your account will be upgraded!', 
                            onPress: () => handleUpgrade()
                        });
                    }}
                    disabled={!selectedLevel}
                    buttonStyle={styles.button} title='Upgrade account' />
                </View>
            </View>
        </>
    );
};