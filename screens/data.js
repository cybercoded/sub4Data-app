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
  ScrollViewHeader,
  storeData,
  styles,
  theme,
} from "../components/global";
import { Button, ButtonGroup, Card, Icon, Input, ListItem } from "react-native-elements";
import { dummies } from "../components/dummies";
import { Context } from "../components/userContext";
import indexOf from "lodash/indexOf";

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

  const buttons = mainOptions?.map(list => (
    <Text>{list.sub_service_name}</Text>
  ));
  
  return (
    <View style={styles.container}>
      <Loader
          submittion={() => changeOption(buttonChange)}
          props={valueState.loader}
          handler={() => valueDispatch({loader: {...valueState.loader, visible: false}})}
      /> 
     <View style={{flex: 2}}>        
        <ScrollViewHeader
            image={dummies.images.networks[network]}
            title={`Purchase ${network.toUpperCase()} Data`}
            subTitle={`Wallet Balance = ${valueState.basicData?.balance}`}
        />
      </View>
      <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
            justifyContent: 'center'
          }}
        >
          <ButtonGroup
              containerStyle={{height: 50, marginHorizontal: 0, width: '100%'}} 
              buttons={buttons}
              onPress={(value) => {
                setbuttonChange(mainOptions[value]['sub_service_code']);
                changeOption(mainOptions[value]['sub_service_code']);
              }}
              selectedIndex={indexOf(mainOptions.map(list => list.sub_service_code), buttonChange)}
          />
      </View>
      <View style={{flex: 4, width: '100%' }}>
        <ScrollView>
          {dataOptions?.map((item, index) => (

            <ListItem
              key={index }
              Component={TouchableOpacity}
              bottomDivider={true}
              onPress={() => 
                navigation.navigate("BuyData", {
                  network: network,
                  product_code: item.product_code,
                  description: item.available_service_description,
                  amount: item.available_service_default_price,
                })
              }
            >
              <ListItem.Content>
                  <ListItem.Title>{item.available_service_name}</ListItem.Title>
                  <ListItem.Subtitle>{item.available_service_description}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron size={40}/>
            </ListItem>
          ))} 
        </ScrollView>         
      </View>
    </View>
  );
};
