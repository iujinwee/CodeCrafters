import React from "react";
import LandingIcon from "@src/assets/splash/LandingLogo.png";
import BaseButton from "@src/components/utils/button";
import { View, Text, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "react-native-screens";

const AuthHomeUI = () => {
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
        <View className={`flex flex-row space-x-4`}>
          <View>
            <BaseButton title="Login" link="/auth/login" />
          </View>
          <View>
            <BaseButton title="Sign up" link="/auth/signup" />
          </View>
        </View>
      </Screen>
    </SafeAreaProvider>
  );
};

export default AuthHomeUI;
