import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function TabLayout() {
  const homeIcon = () => <Text>🏠</Text>;
  const listingsIcon = () => <Text>📦</Text>;
  const registeredIcon = () => <Text>📆</Text>;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        title={"Home"}
        options={{ title: "Home", tabBarIcon: homeIcon }}
      />
      <Tabs.Screen
        name="joblistings"
        options={{
          title: "Listings",
          tabBarIcon: listingsIcon,
        }}
      />
      <Tabs.Screen
        name="registered"
        options={{
          title: "Registered",
          tabBarIcon: registeredIcon,
          href: "jobseeker/registered/jobs",
        }}
      />
    </Tabs>
  );
}
