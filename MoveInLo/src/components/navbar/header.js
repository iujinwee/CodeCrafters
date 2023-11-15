import { router, Stack } from "expo-router";
import React from "react";
import BaseButton from "@src/components/utils/button";
import * as SecureStore from "expo-secure-store";

const Header = ({ children, signOut, hideHeader, ...props }) => {
  const SignOutButton = () => {
    const signOutHandler = async () => {
      // Need to check if it throws error
      // router.replace("/");
      try {
        await Promise.all([
          SecureStore.setItemAsync("accountId", "null"),
          SecureStore.setItemAsync("serviceId", "null"),
          SecureStore.setItemAsync("jobId", "null"),
        ]);
      } catch (e) {
        console.log("Error in signing out.");
      }

      router.push("auth/login");
    };
    return signOut ? (
      <BaseButton
        title={"Sign Out"}
        height={30}
        onPress={() => signOutHandler()}
      />
    ) : null;
  };
  return (
    <Stack
      screenOptions={{
        // Header Title
        title: "MoveInLo!",
        headerStyle: {
          backgroundColor: "#181C62",
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
          fontFamily: "RobotoBold",
        },
        headerShown: !hideHeader ?? true,

        // Header Back Button
        headerBackTitle: "Back",
        headerBackStyle: {
          backgroundColor: "#181C62",
        },
        headerBackTitleStyle: {
          fontFamily: "RobotoMedium",
        },
        headerBackTitleVisible: true,
        headerBackVisible: true,
        headerRight: SignOutButton,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};

export default Header;
