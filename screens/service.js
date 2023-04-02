import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Button, Icon, Input } from "react-native-elements";
import { styles, theme } from "../components/global";
import { dummies } from "../components/dummies";

export const Service = ({ route, navigation }) => {
  const { page } = route.params;

  return (
    <View
      style={{
        backgroundColor: theme.colors.dim,
        padding: 20,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
      }}
    >
      <View>
        <Text style={{ fontWeight: 'bold', textAlign: "center" }}>
          {dummies[page].labels.header}
        </Text>
        <Text>{dummies[page].labels.subHeader}</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {dummies[page]["lists"].map( (list, index) => (
          <TouchableOpacity
            key={list.id}
            style={[styles.menuListStyle, { flex: "40%" }]}
            onPress={() => {
                alert(list.iconName)
              navigation.navigate(dummies[page].lists[index].page, {
                network: list.network,
                description: list.text,
                service: list.service,
                icon: list.iconName,
              });
            }}
          >
            {list.icon ? (
              <Icon
                color={theme.colors.primary}
                size={40}
                name={list.iconName}
              />
            ) : (
              <Image
                style={{ width: 50, height: 50, borderRadius: 50 }}
                source={{ uri: list.iconName }}
              />
            )}
            <Text numberOfLines={1} style={{ textAlign: "center" }}>
              {list.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
