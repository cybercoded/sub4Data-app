import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  API,
  BASE_URL,
  getData,
  Loader,
  LOCAL_API,
  storeData,
  styles,
  theme,
} from "../components/global";
import { Button, Card, Icon, Input } from "react-native-elements";
import { dummies } from "../components/dummies";
import { Context } from "../components/userContext";

export const Data = ({ route, navigation }) => {
  const { network, service_code } = route.params;
  const [buttonChange, setbuttonChange] = useState(null);
  const [dataOptions, setDataOptions] = useState([]);
  const [mainOptions, setMainOptions] = useState([]);

  const {valueState, valueDispatch} = React.useContext(Context);

  const changeOption = (code) => {
    valueDispatch({loader: {...valueState.loader, visible: true}});
    if (!code) {
      valueDispatch({loader: {...dummies.modalProcess.error, text: 'This service is not available at the moment, please try again later.'}});
    }
    API.post(`get-sub-services.php?userId=${valueState.basicData?.userId}&service=others/get_available_services.php`, {service_code: service_code, sub_service_code: code})
    .then((res) => {
      storeData("available-services", res.data.data);

      setDataOptions(res.data.data);
      valueDispatch({loader: {...valueState.loader, visible: false}});
      
    }).catch(error => {
      console.log(error)
      valueDispatch({loader: {...valueState.loader, text: error.message, icon: 'highlight-off'}});
    })
  };  

  useEffect(() => {
    getData(service_code).then((res) => {
      const filteredMainList = res.filter((item) => item.sub_service_code.includes(network))

      setMainOptions(filteredMainList);
      setbuttonChange(filteredMainList[0]?.sub_service_code);
      changeOption(filteredMainList[0]?.sub_service_code);
    });
      
  }, [JSON.stringify(valueState.basicData)]);

  
  return (
    <View style={styles.centerContainer}>      
      <View style={{ marginVertical: 20, alignItems: "center" }}>
        <Image 
          style={{ height: 100, width: 100 }} 
          source={dummies.images.networks[network]} 
        />
        <Text style={{ marginVertical: 10}}>
          <Text style={{fontWeight: 'bold'}}>{network.toUpperCase()} Airtime VTU</Text>
        </Text>
        <Text style={{ fontWeight: 'bold' }}>Wallet Balance = 0.0</Text>
      </View>
        <ScrollView style={{width: '100%'}}>
          <View style={{ margin: 0, marginBottom: 20 }}>
            <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  justifyContent: 'center'
                }}
              >{ mainOptions?.map(list => (
                  <View
                    key={list.sub_service_id}
                    style={[styles.menuListStyle, { 
                      borderRadius: 5,
                      borderWidth: 1,
                      justifyContent: 'center',
                      margin: 5,
                      paddingVertical: 10,
                      borderColor: theme.colors.gray,
                      backgroundColor:
                        theme.colors[
                          buttonChange == list.sub_service_code
                            ? "primary"
                            : 'dim'
                        ],
                    }]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setbuttonChange(list.sub_service_code);
                        changeOption(list.sub_service_code);
                      }}
                    >
                      <Text style={{ fontWeight: buttonChange == list.sub_service_code ? 'bold' : 'normal'}}>
                        <Text style={{color: buttonChange == list.sub_service_code && "#fff"}}>
                          {list.sub_service_name}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>
        
          {dataOptions?.map((list) => (
            <TouchableOpacity
              key={list.available_service_id}
              onPress={() =>
                navigation.navigate("BuyData", {
                  network: network,
                  product_code: list.product_code,
                  description: list.available_service_description,
                  amount: list.available_service_default_price,
                })
              }
            >
              <View
                style={{
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  borderWidth: 0,
                  backgroundColor: theme.colors.dimmer,
                  paddingVertical: 15,
                  marginHorizontal: 0,
                  flex: 1,
                  flexDirection: "row",
                  marginBottom: 5,
                  justifyContent: "space-between",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text>{list.available_service_name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={2}>
                    {list.available_service_description}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.primary }}>
                    <Text style={{fontWeight: 'bold'}}>NGN {list.available_service_default_price}</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <Loader
            submittion={() => changeOption(buttonChange)}
            props={valueState.loader}
            handler={() => valueDispatch({loader: {...valueState.loader, visible: false}})}
          />
        </ScrollView>
      </View>
  );
};
