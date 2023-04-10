import { ScrollView, View, TouchableOpacity, Image, Modal, Text } from 'react-native'
import React from 'react'
import { Header, Icon, Card, BottomSheet } from 'react-native-elements'
import { styles, theme } from '../components/global'
import { dummies } from '../components/dummies'
import { Context } from '../components/userContext'

export const Dashboard = ({ navigation }) => {
    const [menuModal, setmenuModal] = React.useState(false)
    const { valueState, valueDispatch } = React.useContext(Context);	

    return (
        <>
            <Header
                barStyle="default"
                centerComponent={{
                    text: 'SUB4DATA',
                }}
                placement="left"
                leftComponent={{
                    icon: 'menu',
                    onPress: () => setmenuModal(!menuModal),
                }}
                rightComponent={{ 
                    icon: 'settings', 
                    onPress: () => navigation.navigate('Profile')
                }}
            />

            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Card
                            containerStyle={{
                                backgroundColor: theme.colors.primary,
                                margin: 0,
                                color: '#fff',
                                borderRadius: 10,
                            }}
                        >
                            <View style={styles.rowFlex}>
                                <View style={{flex: 3}}>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: 'white',
                                            width: '90%',
                                            fontSize: 20,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {valueState.basicData.fullName}
                                    </Text>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        <Text style={{color: 'white'}}>Bank Details</Text>
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{ fontWeight: 'bold', color: 'white' }}>Available Balance</Text>
                                    <Text style={{ color: 'white', textAlign: 'right' }}>0.00</Text>
                                </View>
                            </View>
                            <View style={styles.rowFlex}>
                                <View>
                                    <Text style={{ color: 'white' }}>Wema Bank</Text>
                                    <Text style={{ color: 'white' }}>8613011866</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'white'}}>Earnings Balance</Text>
                                    <Text style={{ color: 'white', textAlign: 'right' }}>0.00</Text>
                                </View>
                            </View>
                        </Card>

                        <View style={[styles.rowFlex, {marginVertical: 20}]}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    padding: 10,
                                    height: 80,
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                }}
                                onPress={() =>
                                    setBottomModal({
                                        visible: !bottomModal.visible,
                                        content: 'fundWallet',
                                    })
                                }
                            >
                                <Icon color={theme.colors.primary} size={40} name="account-balance-wallet" />
                                <Text>Fund Wallet</Text>
                            </TouchableOpacity>

                            <View style={{ width: 10 }}></View>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    padding: 10,
                                    height: 80,
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                }}
                                onPress={() =>
                                    setBottomModal({
                                        visible: !bottomModal.visible,
                                        content: 'agent',
                                    })
                                }
                            >
                                <Icon color={theme.colors.primary} size={40} name="verified-user" />
                                <Text>Agent</Text>
                            </TouchableOpacity>

                            <View style={{ width: 10 }}></View>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    padding: 10,
                                    height: 80,
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                }}
                                onPress={() =>
                                    setBottomModal({
                                        visible: !bottomModal.visible,
                                        content: 'refer',
                                    })
                                }
                            >
                                <Icon color={theme.colors.primary} size={40} name="people" />
                                <Text>Refer</Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 20,
                            }}
                        >
                            <Card
                                containerStyle={{ flex: 1, margin: 0, borderRadius: 10 }}
                                wrapperStyle={{ position: 'relative', alignItems: 'center' }}
                            >
                                <Text>User's Comments</Text>
                            </Card>

                            <View style={{ width: 10 }}></View>

                            <Card
                                containerStyle={{ flex: 1, margin: 0, borderRadius: 10 }}
                                wrapperStyle={{ position: 'relative', alignItems: 'center' }}
                            >
                                <Text>sub4Data's API</Text>
                            </Card>
                        </View>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            flexWrap: 'wrap',
                        }}
                    >
                        <TouchableOpacity
                            style={styles.menuListStyle}
                            onPress={ () => navigation.navigate('AirtimeService') }
                        >
                            <Icon color={theme.colors.primary} size={40} name="smartphone" />
                            <Text>Buy Airtime</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuListStyle}
                            onPress={ () => navigation.navigate('SMEDataService') }
                        >
                            <Icon color={theme.colors.primary} size={40} name="wifi" />
                            <Text>Buy SME Data</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuListStyle}
                            onPress={ () => navigation.navigate('DirectDataService') }
                        >
                            <Icon color={theme.colors.primary} size={40} name="wifi" />
                            <Text>Buy Direct Data</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuListStyle}
                            onPress={ () => navigation.navigate('ElectricityService') }
                        >
                            <Icon color={theme.colors.primary} size={40} name="lightbulb-outline" />
                            <Text>Buy Electricity</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuListStyle}
                            onPress={ () => navigation.navigate('CableService') }
                        >
                            <Icon color={theme.colors.primary} size={40} name="connected-tv" />
                            <Text>Buy Cable TV</Text>
                        </TouchableOpacity>

                        <View style={styles.menuListStyle}>
                            <Icon color={theme.colors.primary} size={40} name="payments" />
                            <Text>Withdraw earnings</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}
