import React, { useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";
import {
  getData,
  storeData,
  styles,
  theme,
} from "../components/global";
import { Button, Icon, Input, Text } from "react-native-elements";
import { dummies } from "../components/dummies";

import { VerifyPin } from "./verifyPin";

export const Welcome = ({ navigation }) => {

  const [pinScreen, setPinScreen] = React.useState(false);
  const windowsWidth  = Dimensions.get('window').width;

  const [sliders, setSliders] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const [currentSlide, setCurrentSlide] = useState(1);


  React.useEffect(() => {
    getData('basicData').then(res => {
      if( res.pin.length === 4 && res.isLoggedIn == true ) {
        setPinScreen(true);
        // navigation.navigate('Home');
        return;
      }else if( res.pin.length === 4 && res.isLoggedIn == false ) {
        navigation.navigate('Signin');
        return;
      }else if( res?.pin.length === 0 ) {
        navigation.navigate('Signin');
      }
    });
  }, []);

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
    <>
      <View style={[styles.centerContainer, {backgroundColor: theme.colors.primary}]}>
        <View style={{ flex: 8, alignItems: 'center'}}>
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
                  <Text style={{ marginVertical: 10, textAlign: 'center', fontSize: 20, color: theme.colors.white}}>
                    {slider.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>          
        </View>
          
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{flex: 1}}>
            <View style={[styles.rowFlex, { width: 80 }]}>
                {dummies.welcomePageSliders.map((slider) => (
                  <TouchableOpacity
                    key={slider.id}
                    onPress={() => navSlides("", slider.id)}
                  >
                    <View style={sliders[slider.id] ? styles.currentDot : styles.dots}></View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          <View style={{flex: 4}}>
            <View style={{width: windowsWidth-50}}>
                  <Button
                    title="Prev"
                    type="clear"
                    disabled={currentSlide < 1}
                    buttonStyle={styles.button}
                    titleStyle={{color: theme.colors.white}}
                    onPress={() => navSlides("prev")}
                  />
              {currentSlide < Object.values(sliders).length ? (
                  <Button
                    title="Next"
                    type="outline"
                    onPress={() => navSlides("next")}
                    buttonStyle={[styles.button, {backgroundColor: theme.colors.white}]}
                    icon={<Icon name="arrow-right" size={30} color={theme.colors.dim} />}
                    iconLeft
                  />
              ) : (
                <Button
                  title="Get Started"
                  onPress={() => navigation.navigate("Registration")}
                  buttonStyle={[styles.button, {backgroundColor: theme.colors.dim}]}
                  icon={<Icon name="arrow-right" size={30} color="white" />}
                  iconRight
                />
              )}
            </View>
          </View>
        </View>
      </View>
      
      <VerifyPin
          isVisible={pinScreen} 
          closePinScreen={() => setPinScreen(false)} 
          action={() =>  navigation.navigate('Home') } 
      />
    </>
  );
};
