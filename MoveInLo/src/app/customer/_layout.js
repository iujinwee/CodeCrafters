import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function TabLayout() {
  const homeIcon = () => <Text>🏠</Text>;
  const scheduleIcon = () => <Text>📆</Text>;
  const trackerIcon = () => <Text>⏳</Text>;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        title={"Home"}
        options={{
          title: "Home",
          tabBarIcon: homeIcon,
          href: "/customer/home",
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: scheduleIcon,
          href: "/customer/schedule/options",
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: trackerIcon,
          href: "/customer/calendar/agenda",
        }}
      />
    </Tabs>
  );
}
