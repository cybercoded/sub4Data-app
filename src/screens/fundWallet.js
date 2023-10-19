import React from "react";
import { styles, theme } from "../components/global";
import { TouchableOpacity, View, Image } from "react-native";
import { Icon, ListItem, Text } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const FundWallet = ({route, navigation}) => {
    const { slug } = route.params;
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
                            <Text h4 h4Style={{color: theme.colors.white, marginStart: 10}}>Fund wallet</Text>
                        </View>
                </View>
            }
                
            <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
                <View style={{ width: '90%'}}>
                    <ListItem
                        Component={TouchableOpacity}
                        bottomDivider={true}
                        style={styles.shadowLists}
                        onPress={() => navigation.navigate("AutomatedBanks") }
                    >
                        <MaterialCommunityIcons color={theme.colors.dim} raised size={50} name="bank-transfer" />
                        <ListItem.Content>
                            <ListItem.Title>
                                Automated Banks 
                            </ListItem.Title>
                            <ListItem.Subtitle>
                                Pay using Monnify Automated Banks with less charges (fast and reliable) 
                            </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron size={40}/>
                    </ListItem>

                    <ListItem
                        Component={TouchableOpacity}                        
                        style={styles.shadowLists}
                        bottomDivider={true}
                        onPress={() =>  navigation.navigate("MerchantPayment")}
                    >
                        <MaterialCommunityIcons color={theme.colors.dim} raised size={40} name="bank" />
                        <ListItem.Content>
                            <ListItem.Title>
                                Monnify Payment
                            </ListItem.Title>
                            <ListItem.Subtitle>
                                Pay using Monnify Merchant Payment with affordable charges
                            </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron size={40}/>
                    </ListItem>
                </View>
            </View>
        </>
    );
};