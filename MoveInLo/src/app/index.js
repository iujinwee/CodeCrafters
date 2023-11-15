import React from "react";
import LandingIcon from "@src/assets/splash/LandingLogo.png";
import BaseButton from "@src/components/utils/button";
import { View, Text, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "react-native-screens";

const App = () => {
  return (
    <SafeAreaProvider className={`bg-primary`}>
      <Screen
        className={`h-5/6 w-full flex flex-col items-center justify-center space-y-5`}
      >
        <View>
          <Text
            className={`font-RobotoBold text-white text-2xl text-center p-5`}
          >
            Welcome to
          </Text>
          <Image source={LandingIcon} />
          <Text
            className={`font-RobotoBold text-white text-2xl text-center p-5`}
          >
            MoveInLo!
          </Text>
        </View>
        <View className={"items-center"}>
          <BaseButton title="Begin" link="auth" />
        </View>
      </Screen>
    </SafeAreaProvider>
  );
};

export default App;
