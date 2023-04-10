import React, { useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";
import {
  storeData,
  styles,
  theme,
} from "../components/global";
import { BottomSheet, Button, Icon, Input, Text } from "react-native-elements";
import { dummies } from "../components/dummies";
import { Context } from "../components/userContext";
import { clearData } from "../components/global";

export const Welcome = ({ navigation }) => {

  const { valueState, valueDispatch } = React.useContext(Context);
  const windowsWidth  = Dimensions.get('window').width;


  const [IPConfigurationValue, setIPConfigurationValue] = useState('http://192.168.70.102/');
  const [IPConfigurationModal, setIPConfigurationModal] = useState(false);
  const [sliders, setSliders] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const [currentSlide, setCurrentSlide] = useState(1);

  const redirector = () => {
    if (valueState.basicData) {
      if( valueState.basicData.pinCode.length === 4 && valueState.basicData.isLoggedIn == true ) {
        navigation.navigate('VerifyPin', {landingPage: 'Dashboard'});
        return;
      }else if( valueState.basicData.pinCode.length === 4 && valueState.basicData.isLoggedIn == false ) {
        navigation.navigate('Signin');
        return;
      }else if( valueState.basicData?.pinCode.length === 0 ) {
        navigation.navigate('Signin');
      }
    }
  };

  React.useEffect(() => {

    redirector();

  }, [valueState.basicData]);

  const navSlides = (action, goToSlide) => {
    let calculation = goToSlide
      ? goToSlide
      : action == "next"
      ? currentSlide + 1
      : currentSlide - 1;
    let length = Object.values(sliders).length;
    if (calculation <= length && calculation > 0) {
      setCurrentSlide(calculation);

      setSliders({
        1: false,
        2: false,
        3: false,
        4: false,
      });
      setSliders((prevState) => ({
        ...prevState,
        [calculation]: !prevState.calculation,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 12, alignItems: 'center'}}>
        <ScrollView horizontal={true}>
          {dummies.welcomePageSliders.map((slider) => (
            <View
              key={slider.id}
              style={{
                display: sliders[slider.id] ? "flex" : "none",
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <View style={{ marginVertical: 20, alignItems: "center", width: (windowsWidth-50)}}>
                <Image
                  style={{ height: 100, width: 100 }}
                  source={slider.image}
                />
                <Text style={{ marginVertical: 10, textAlign: 'center', fontSize: 20, color: theme.colors.dim}}>
                  {slider.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>          
      </View>
        
      <View style={{flex: 3, alignItems: 'center', justifyContent: 'flex-end'}}>
        <View style={{flex: 1}}>
          <View style={[styles.rowFlex, { width: 80 }]}>
              {dummies.welcomePageSliders.map((slider) => (
                <TouchableOpacity
                  key={slider.id}
                  onPress={() => navSlides("", slider.id)}
                >
                  <View
                    style={sliders[slider.id] ? styles.currentDot : styles.dots}
                  ></View>
                </TouchableOpacity>
              ))}
          </View>
        </View>
        <View style={{flex: 2}}>
          <View style={{width: windowsWidth-50}}>
            {currentSlide > 1 && (
                <Button
                  title="Prev"
                  type="clear"
                  buttonStyle={styles.button}
                  onPress={() => navSlides("prev")}
                />
            )}
            {currentSlide < Object.values(sliders).length ? (
                <Button
                  title="Next"
                  type="outline"
                  onPress={() => navSlides("next")}
                  buttonStyle={styles.button}
                  icon={<Icon name="arrow-right" size={30} color={theme.colors.primary} />}
                  iconLeft
                />
            ) : (
              <Button
                title="Get Started"
                type="solid"
                onPress={() => navigation.navigate("Registration")}
                buttonStyle={styles.button}
                icon={<Icon name="arrow-right" size={30} color="white" />}
                iconRight
              />
            )}
          </View>
        </View>
      </View>
      <BottomSheet
        isVisible={IPConfigurationModal}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
      >
        <View>
          <Input 
              value={IPConfigurationValue}
              onChangeText={value => {
                setIPConfigurationValue(value);
                console.log(value);
              }}
              inputStyle={styles.input}
          />
          <Button
              title="Configure"
              type="solid"
              onPress={() => {
                  setIPConfigurationModal(false);
                  storeData('localURL', IPConfigurationValue);
              }}
              buttonStyle={[styles.button, {width: 200, alignSelf: 'center'}]}
          />
        </View>
        
        
      </BottomSheet>
    </View>
  );
};
