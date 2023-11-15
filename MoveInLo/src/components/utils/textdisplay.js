import { Text, View } from "react-native";

const TextDisplay = ({ title, content }) => {
  return (
    <View className={"my-0.5 "}>
      <Text className={"font-RobotoBold "}>
        {title}:{" "}
        <Text className={"font-RobotoRegular text-[14px]"}>{content}</Text>
      </Text>
    </View>
  );
};

export default TextDisplay;
