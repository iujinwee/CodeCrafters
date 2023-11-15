import { Image, Text, View } from "react-native";
import React from "react";

const BaseCard = ({ title, index, description, source }) => {
  const size = 75;
  return (
    <View className={"flex flex-row mx-5 my-3 pb-2 border-b-[1px] border-gray"}>
      <View className={"items-center justify-center mx-3"}>
        <Image
          source={source}
          style={{ height: size, width: size, borderRadius: 10 }}
        />
      </View>
      <View className={"flex flex-col ml-4 w-4/6"}>
        <View>
          <Text className={"font-RobotoRegular"}>
            {index}. {title}
          </Text>
        </View>
        <View
          className={"bg-gray-200 w-16 mt-2 p-1 items-center justify-center"}
        >
          <Text className={"font-RobotoMedium"}>Step {index}</Text>
        </View>
        <View className={"mt-2"} style={{ flexDirection: "row" }}>
          <Text
            className={"font-RobotoLight"}
            style={{ flex: 1, flexWrap: "wrap" }}
          >
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BaseCard;
