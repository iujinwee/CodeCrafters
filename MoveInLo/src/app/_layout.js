import React, { useCallback } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import ThemeProvider from "@src/assets/theme/ThemeProvider";
import { extendTheme, NativeBaseProvider } from "native-base";
import * as SplashScreen from "expo-splash-screen";

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    RobotoBlack: require("@src/assets/fonts/RobotoBlack.ttf"),
    RobotoBold: require("@src/assets/fonts/RobotoBold.ttf"),
    RobotoLight: require("@src/assets/fonts/RobotoLight.ttf"),
    RobotoMedium: require("@src/assets/fonts/RobotoMedium.ttf"),
    RobotoRegular: require("@src/assets/fonts/RobotoRegular.ttf"),
  });

  const onFontLayoutView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const theme = extendTheme({
    colorScheme: {
      primary: "#181C62",
    },
    colors: {
      primary: {
        100: "#181C62",
      },
      secondary: {
        100: "#D71440",
      },
    },
    components: {
      Input: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          backgroundColor: "white",
          borderColor: "gray",
          fontFamily: "RobotoMedium",
          marginY: 2,
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
          onLayout={onFontLayoutView}
        >
          <Stack.Screen name={"auth"} />
          <Stack.Screen name={"customer"} />
          <Stack.Screen name={"jobseeker"} />
        </Stack>
      </ThemeProvider>
    </NativeBaseProvider>
  );
};

export default RootLayout;
