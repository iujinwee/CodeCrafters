import { Text, TextInput, View } from "react-native";
import React from "react";

const BaseInput = ({ title, defaultValue, className, ...props }) => {
  return (
    <View className={"my-2 w-full"}>
      <View className={"mb-2 "}>
        <Text className={"font-RobotoMedium"}>{title ?? "Title"}</Text>
      </View>
      <View className={"border-[1px] rounded-md bg-white p-2 flex"}>
        <TextInput
          {...props}
          defaultValue={defaultValue}
          className={"font-RobotoRegular items-center"}
        />
      </View>
    </View>
  );
};

export default BaseInput;
