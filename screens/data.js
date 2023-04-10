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
  const { sub_service_code, sub_service_name } = route.params;
  const [buttonChange, setbuttonChange] = useState(null);
  const [dataOptions, setDataOptions] = useState([]);
  const [mainOptions, setMainOptions] = useState([]);

  const {valueState, valueDispatch} = React.useContext(Context);


  useEffect(() => {
    valueDispatch({loader: {...dummies.modalProcess.loading}});
    API.post(`get-sub-services.php?userId=${valueState.basicData?.userId}&service=others/get_available_services.php`, {
      service_code: 'sme_data_share', 
      sub_service_code: sub_service_code
    })
    .then((res) => {
      setDataOptions(res.data.data);
      valueDispatch({loader: {...dummies.modalProcess.hide}});
      
    }).catch(error => {
      console.log(error)
      valueDispatch({loader: {...dummies.modalProcess.error, text: error.message}});
    })
      
  }, [JSON.stringify(valueState.basicData)]);

  const buttons = mainOptions?.map(list => (
    <Text>{list.sub_service_name}</Text>
  ));
  
  return (
    <View style={styles.container}>
      <Loader
          submittion={() => changeOption(buttonChange)}
          props={valueState.loader}
          handler={() => valueDispatch({loader: {...dummies.modalProcess.hide}})}
      /> 
     <View style={{flex: 2}}>        
        <ScrollViewHeader
            image={dummies.images[sub_service_code]}
            title={`Purchase ${sub_service_name} Data`}
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
