import { Alert, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {Button, Icon, ListItem } from 'react-native-elements';
import { API, Loader, getData, storeData, styles, theme } from '../components/global';
import { Context } from '../components/userContext';
import { dummies } from '../components/dummies';
import delay from 'lodash/delay';


export const UpgradeAccount = ({route, navigation}) => {
    const { valueState, valueDispatch } = React.useContext(Context);
    const [levelLists, setLevelLists] = React.useState([]);
    const [currentLevel, setCurrentLevel] = React.useState();
    const [selectedLevel, setSelectedLevel] = React.useState();

    React.useEffect(() => {
        valueDispatch({ loader: { ...dummies.modalProcess.loading } });
        API.get(`view-levels`).then((res) => {
            if (res.data.status === 200) {
                setLevelLists(res.data.levels);
                valueDispatch({ loader: { ...dummies.modalProcess.hide } });
            } else {
                valueDispatch({ loader: { ...dummies.modalProcess.error, text: res.data.errors } });
            }            
        }).catch((err) => {
            valueDispatch({ loader: { ...dummies.modalProcess.error, text: err } });
        });

        getData('basicData').then((res) => {
            setCurrentLevel(res.level)
        })
    }, []);

    const handleUpgrade = () => {
        valueDispatch({loader: {...dummies.modalProcess.loading}});
        API.post(`upgrade-user`, {level: selectedLevel}).then((res) => {
            if ( res.data.status === 200 ) {
                valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message+', please wait to be refreshed'}});
                API.get(`get-user`).then((res) => {
                    if ( res.data.status === 200) {                                       
                        storeData('basicData', {...res.data.data});
                        valueDispatch({loader: {...dummies.modalProcess.success, text: res.data.message}});                                
                        delay(() => {
                            valueDispatch({loader: {...dummies.modalProcess.hide}});
                            navigation.navigate('Home');
                        }, 2000);                                
                    }
                });
            } else {
                valueDispatch({loader: {...dummies.modalProcess.error, text: res.data.errors}});
            }
        })
        .catch((err) => {
            valueDispatch({loader: {...dummies.modalProcess.error, text: err.message}});
            console.error(err.message);
        });
    };

    return (
        <>
            <View style={{flex: 10, alignItems: 'center'}}>
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
                            containerStyle={{
                                    marginVertical: 10,
                                    borderColor: selectedLevel === item.level && theme.colors.primary,
                                    borderWidth: selectedLevel === item.level && 2,
                                    backgroundColor: currentLevel >= item.level && theme.colors.dimmer
                            }}
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
                        valueDispatch({ loader: { ...dummies.modalProcess.error, 
                            icon: 'warning',
                            color: 'orange',
                            text: 'Are you sure you want to upgrade your account' } 
                        })
                    }}
                    disabled={!selectedLevel}
                    buttonStyle={styles.button} title='Upgrade account' />
                </View>
            </View>
            <Loader
                handleRetry={() => handleUpgrade() }
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide}})}
                props={valueState.loader}
                actionText='Continue'
            />
        </>
    );
};