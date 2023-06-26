import {
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import {
  Icon,
  ListItem,
  Text
} from "react-native-elements";
import { styles, theme } from "../components/global";
import { dummies } from "../components/dummies";
import { Context } from "../components/userContext";
import { LinearGradient } from "expo-linear-gradient";

export const Dashboard = ({ navigation }) => {
  const { valueState, valueDispatch } = React.useContext(Context);

  return (
    <>
        <View style={{ flex: 1, backgroundColor: theme.colors.dimmer }}>
            <View
                style={{
                flex: 1,
                backgroundColor: theme.colors.white,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomEndRadius: 20,
                borderBottomStartRadius: 20,
                }}
            >
                <View style={styles.rowFlex}>
                <Icon
                    name="menu"
                    style={{ marginLeft: 20 }}
                    color={theme.colors.dim}
                    size={45}
                    onPress={() => navigation.toggleDrawer()}
                />
                <Image
                    source={dummies.images.icon}
                    resizeMode="contain"
                    style={{ height: 50, width: 70 }}
                />
                </View>
            </View>

            <View style={{ flex: 3, marginVertical: 15, alignItems: "center" }}>
                <View style={{ width: "95%" }}>
                <LinearGradient
                    colors={[theme.colors.primary, "#189f91"]}
                    start={{ x: 0, y: 0.2 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 30,
                        borderRadius: 10,
                    }}
                >
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', flexBasis: 50}}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Basic user</Text>
                        <Icon
                            name="eye"
                            type="ionicon"
                            color="#fff"
                            // style={{alignItems: 'center', alignSelf: 'center'}}
                        />
                    </View>
                    <Text
                        h3
                        h3Style={{
                            marginBottom: 10,
                            color: "#fff",
                            fontWeight: "bold",
                            marginTop: 20,
                        }}
                    >
                    ₦{new Intl.NumberFormat().format(valueState.basicData?.balance)}
                    </Text>
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                    {valueState.basicData?.name}
                    </Text>
                </LinearGradient>
                </View>
            </View>

            <View style={{ flex: 2, alignItems: "center" }}>
                <View style={[styles.rowFlex, { width: "95%" }]}>
                <TouchableOpacity
                    style={{
                    flex: 1,
                    alignItems: "center",
                    padding: 10,
                    height: 80,
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    marginRight: 10,
                    }}
                    onPress={() => navigation.navigate('FundWallet') }
                >
                    <Icon
                    color={theme.colors.primary}
                    size={40}
                    name="account-balance-wallet"
                    />
                    <Text>Fund Wallet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                    flex: 1,
                    alignItems: "center",
                    padding: 10,
                    height: 80,
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    marginRight: 10,
                    }}
                    onPress={() =>
                    setBottomModal({
                        visible: !bottomModal.visible,
                        content: "agent",
                    })
                    }
                >
                    <Icon color={theme.colors.primary} size={40} name="verified-user" />
                    <Text>Agent</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                    flex: 1,
                    alignItems: "center",
                    padding: 10,
                    height: 80,
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    }}
                    onPress={() => navigation.navigate("FundWallet")}
                >
                    <Icon color={theme.colors.primary} size={40} name="people" />
                    <Text>Refer</Text>
                </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 4, justifyContent: "flex-end" }}>
                <View
                style={{
                    backgroundColor: theme.colors.white,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    alignSelf: "center",
                }}
                >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                    }}
                >
                    <TouchableOpacity
                    style={styles.menuListStyle}
                    onPress={() =>
                        navigation.navigate("ViewProducts", { slug: "airtime" })
                    }
                    >
                    <Icon color={theme.colors.primary} size={40} name="smartphone" />
                    <Text>Buy Airtime</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.menuListStyle}
                    onPress={() =>
                        navigation.navigate("ViewProducts", { slug: "data" })
                    }
                    >
                    <Icon color={theme.colors.primary} size={40} name="wifi" />
                    <Text>Buy SME Data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.menuListStyle}
                    onPress={() =>
                        navigation.navigate("ViewProducts", { slug: "electricity" })
                    }
                    >
                    <Icon
                        color={theme.colors.primary}
                        size={40}
                        name="lightbulb-outline"
                    />
                    <Text>Buy Electricity</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.menuListStyle}
                    onPress={() =>
                        navigation.navigate("ViewProducts", { slug: "bill" })
                    }
                    >
                    <Icon
                        color={theme.colors.primary}
                        size={40}
                        name="connected-tv"
                    />
                    <Text>Buy Cable TV</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </View>
    </>
  );
};
