import { ScrollView, View, TouchableOpacity, Image, Modal, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Header, Icon, Card, BottomSheet } from 'react-native-elements'
import { API, BASE_URL, getData, LOCAL_API, storeData, styles, theme, themes } from '../components/global'
import { dummies } from '../components/dummies'
import { Context } from '../components/userContext'

export const Dashboard = ({ route, navigation }) => {
    const { userId } = route.params
    const [bottomModal, setBottomModal] = useState({
        visible: false,
        content: 'networks',
        page: '',
        service_code: '',
    })
    const [menuModal, setmenuModal] = useState(false)
    const [dataProfile, setProfileData] = useState([])
    const [subOptions, setSubOptions] = useState([])

    const { valueState, valueDispatch } = React.useContext(Context);

	

    useEffect(() => {
        //Auto loggin account for dom use
        storeData('isLoggedIn', true)

        getData('isLoggedIn').then((res) => {
            if (!res) {
                navigation.navigate('Signin')
            }
        });
		
        getData('basicData').then((res) => {
            setProfileData(res)
        });
		if (valueState.basicData?.userId) {
			API.post(`get-sub-services.php?userId=${valueState.basicData?.userId}&service=others/get_sub_services.php`, {
				service_code: 'sme_data_share',
			})
			.then((res) => {
				storeData('sme_data_share', res.data.data)
				return
			})
			.catch((error) => {
				console.error(error)
			})
			API.post(`get-sub-services.php?userId=${valueState.basicData?.userId}&service=others/get_sub_services.php`, {
				service_code: 'data_topup',
			})
			.then((res) => {
				storeData('data_topup', res.data.data)
			})
			.catch((error) => {
				console.error(error)
			})
		}
    }, [valueState.basicData?.userId])

    return (
        <View style={{ backgroundColor: '#fff' }}>
            <Header
                barStyle="default"
                centerComponent={{
                    text: 'SUB4DATA',
                    style: { color: theme.colors.primary },
                }}
                placement="left"
                containerStyle={{ width: '100%', borderWidth: 0, backgroundColor: '#f1f1f1' }}
                leftComponent={{
                    icon: 'menu',
                    color: theme.colors.primary,
                    onPress: () => setmenuModal(!menuModal),
                }}
                rightComponent={{ icon: 'home', color: theme.colors.primary }}
            />

            <ScrollView style={{ backgroundColor: '#f1f1f1', padding: 10 }}>
                <View>
                    <Card
                        containerStyle={{
                            backgroundColor: theme.colors.primary,
                            margin: 0,
                            color: '#fff',
                            borderRadius: 10,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: 'white',
                                        width: '90%',
                                        fontSize: 18,
                                    }}
                                >
                                    {dataProfile.fullName}
                                </Text>
                                <Text style={{ fontWeight: 'bold' }}>
									<Text style={{color: 'white'}}>Bank Details</Text>
								</Text>
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>Available Balance</Text>
                                <Text style={{ color: 'white', textAlign: 'right' }}>0.00</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
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

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 20,
                        }}
                    >
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
                            <Text>TomAlert's API</Text>
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
                        onPress={() =>
                            setBottomModal({
                                visible: !bottomModal.visible,
                                content: 'networks',
                                page: 'Airtime',
                            })
                        }
                    >
                        <Icon color={theme.colors.primary} size={40} name="smartphone" />
                        <Text>Buy Airtime</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuListStyle}
                        onPress={() => {
                            setBottomModal({
                                visible: !bottomModal.visible,
                                content: 'networks',
                                page: 'Data',
                                service_code: 'sme_data_share',
                            })
                        }}
                    >
                        <Icon color={theme.colors.primary} size={40} name="wifi" />
                        <Text>Buy SME Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuListStyle}
                        onPress={() =>
                            setBottomModal({
                                visible: !bottomModal.visible,
                                content: 'networks',
                                page: 'Data',
                                service_code: 'data_topup',
                            })
                        }
                    >
                        <Icon color={theme.colors.primary} size={40} name="wifi" />
                        <Text>Buy Direct Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuListStyle}
                        onPress={() =>
                            setBottomModal({
                                visible: !bottomModal.visible,
                                content: 'electricity',
                                page: 'BuyElectricity',
                            })
                        }
                    >
                        <Icon color={theme.colors.primary} size={40} name="lightbulb-outline" />
                        <Text>Buy Electricity</Text>
                    </TouchableOpacity>

                    <View style={styles.menuListStyle}>
                        <Icon color={theme.colors.primary} size={40} name="connected-tv" />
                        <Text>Buy Cable TV</Text>
                    </View>

                    <View style={styles.menuListStyle}>
                        <Icon color={theme.colors.primary} size={40} name="payments" />
                        <Text>Withdraw earnings</Text>
                    </View>
                </View>
            </ScrollView>

            <BottomSheet
				onTouchStart={(event) =>
					event.target == event.currentTarget && setBottomModal(true)
				}
				isVisible={bottomModal.visible}
				modalProps={{
					visible: bottomModal.visible,
				}}
			>
                <TouchableOpacity
                    style={styles.bottomModalCenteredView}
                    onPress={() => setBottomModal({ ...bottomModal, visible: !bottomModal.visible })}
                >
                    <TouchableOpacity style={styles.bottomModalView} activeOpacity={1}>
                        <View
                            style={{
                                backgroundColor: theme.colors.dim,
                                padding: 20,
                                borderTopStartRadius: 20,
                                borderTopEndRadius: 20,
                            }}
                        >
                            <View>
                                <Text style={{ fontWeight: 'bold'}}>
									<Text style={{ textAlign: 'center' }}>
                                    	{dummies[bottomModal.content].labels.header}
									</Text>
                                </Text>
                                <Text>{dummies[bottomModal.content].labels.subHeader}</Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    flexWrap: 'wrap',
                                }}
                            >
                                {dummies[bottomModal.content]['lists'].map((list) => (
                                    <TouchableOpacity
                                        key={list.id}
                                        style={[styles.menuListStyle]}
                                        onPress={() => {
                                            navigation.navigate(bottomModal.page, {
                                                network: list.network,
                                                description: list.text,
                                                service: list.service,
                                                id: list.id,
                                                service_code: bottomModal.service_code,
                                            })
                                            setBottomModal({ ...bottomModal, visible: false })
                                        }}
                                    >
                                        {list.icon ? (
                                            <Icon color={theme.colors.primary} size={40} name={list.iconName} />
                                        ) : (
                                            <Image
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 50,
                                                }}
                                                source={list.iconName}
                                            />
                                        )}
                                        <Text numberOfLines={1} style={{ textAlign: 'center' }}>
                                            {list.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </BottomSheet>

            <Modal
                transparent={true}
                visible={menuModal}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.')
                    setModalVisible({ visible: !menuModal })
                }}
            >
                <TouchableOpacity style={styles.menuModalCenteredView} onPress={() => setmenuModal(!menuModal)}>
                    <TouchableOpacity style={styles.menuModalView} activeOpacity={1}>
                        <View style={{height: 120}}>
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
									padding: 20,
                                    backgroundColor: theme.colors.primary,
                                }}
                            >
                                <Image
									style={{width: 70, height: 70}}
									source={require("../assets/icon.png")}
								/>
                            </View>
                        </View>
                        <View style={{flex: 1}}>
                            {dummies.menus.map((list) => (
                                <TouchableOpacity
                                    key={list.id}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
										alignItems: 'center',
                                        borderBottomWidth: 1,
                                        borderBottomColor: theme.colors.dim,
                                    }}
                                    onPress={() => {
                                        navigation.navigate(list.page, {
                                            page: list.service,
                                        })
                                        setmenuModal(!menuModal)
                                    }}
                                >
                                    <View>
										<Icon name={list.icon} color={theme.colors.primary} size={30} style={{ width: 50 }} />
                                    </View>
									<View>
										<Text>{list.text}</Text>
									</View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}
