import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { Button, Icon, Input, ListItem } from 'react-native-elements';
import { API, Loader, ScrollViewHeader, styles, theme } from '../components/global';
import { dummies } from '../components/dummies';
import { Context } from '../components/userContext';
import { TouchableHighlight } from 'react-native';
import { FlatList } from 'react-native';
import { includes, isObject } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Service = ({ route, navigation }) => {
    const {valueState, valueDispatch} = React.useContext(Context);

    const [availableServices, setAvailableServices] = React.useState([]);

    React.useEffect(() => {
      
      valueDispatch({loader: {...dummies.modalProcess.loading, text: 'Fetching available services'}});
      API.get(`get-sub-services.php?userId=1&service=others/get_services.php`)
      .then((res) => {
        if( isObject(res.data) ) {
          valueDispatch({loader: {...dummies.modalProcess.hide}});
          setAvailableServices(res.data.data);
        }
      })
      .catch((error) => {
        valueDispatch({loader: {...dummies.modalProcess.error, text: error}});
      })
    }, [])
    

    return (
      <>
        <View style={styles.container}>
          <View style={{flex: 2}}>
            <ScrollViewHeader
                image={dummies.images.networks['mtn']}
                title='Available services'
                subTitle='Select from the list of services listed below'
            />
          </View>

          <View style={{flex: 4, width: '100%'}}>
            <SafeAreaView>
              {
                <FlatList
                  data={availableServices.filter((item) => item.service_name.includes('Distribution Company'))}
                  renderItem={({item, index}) => {
                    const image = `https://smartrecharge.ng/images/services/${item.main_service_logo}`;
                    return (
                      <ListItem
                          key={index}
                          Component={TouchableOpacity}
                          bottomDivider={true}
                          onPress={() => navigation.navigate('Electricity', {
                            service_code: item.service_code,
                            main_service_logo: image,
                            service_name: item.service_name
                          }) }
                      >
                          <Image 
                            source={{uri: image}} 
                            style={{height: 50, width: 50}}
                          />
                          <ListItem.Content>
                              <ListItem.Title>{item.service_name}</ListItem.Title>
                              <ListItem.Subtitle>{item.main_service_description}</ListItem.Subtitle>
                          </ListItem.Content>
                          <ListItem.Chevron size={40}/>
                      </ListItem>
                    );
                  }}
                />
              }
            </SafeAreaView>
          </View>
        </View>

        <Loader
          props={valueState.loader}
          handler={() => valueDispatch({loader: {...dummies.modalProcess.hide}})}
        />
      </>
    );
};
