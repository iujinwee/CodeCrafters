import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, StatusBar } from "react-native";
import { Agenda } from "react-native-calendars";
import { router, useNavigation } from "expo-router";
import { format } from "date-fns-tz";
import * as Localization from "expo-localization";
import * as XCalendar from "expo-calendar";

const CalendarUI = () => {
  const [events, setEvents] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      async function loadCalendar() {
        const { status } = await XCalendar.requestCalendarPermissionsAsync();
        if (status === "granted") {
          // Load calendar events from all available calendars
          const allCalendars = await XCalendar.getCalendarsAsync(
            XCalendar.EntityTypes.EVENT
          );
          const eventsList = await loadCalendarEvents(allCalendars);
          const formattedEvents = formatEvents(eventsList);
          setEvents(formattedEvents);
        }
      }
      loadCalendar();
    });

    return () => {
      unsubscribe(); // Cleanup when the component is unmounted
    };
  }, [navigation]);

  const loadCalendarEvents = async (calendars) => {
    const now = new Date();
    const startDate = new Date(now);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2);
    const eventsList = [];

    for (const calendar of calendars) {
      const eventsResponse = await XCalendar.getEventsAsync(
        [calendar.id],
        startDate,
        endDate
      );
      eventsList.push(...eventsResponse);
    }
    return eventsList;
  };
  const formatEvents = (eventData) => {
    const formattedEvents = {};

    const { timeZone } = Localization.getCalendars()[0];
    const customFormat = "yyyy-MM-dd HH:mm:ssXXX";

    eventData.forEach((event) => {
      const date = new Date(event.startDate);
      const isoDateString = format(date, customFormat, { timeZone });
      const dateString = isoDateString.split(" ")[0];
      const timeString = isoDateString.split(" ")[1].split("+")[0] + "H";

      if (!formattedEvents[dateString]) {
        formattedEvents[dateString] = [];
      }
      formattedEvents[dateString].push({
        name: event.title,
        time: timeString,
        notes: event.notes,
        location: event.location,
      });
    });
    return formattedEvents;
  };

  // pass values to relevant progress
  const viewDetails = (item) => {
    router.push({
      pathname: "customer/calendar/progress",
      params: { notes: item.notes },
    });
  };

  // const renderDay = (day) => {
  //   if (day) {
  //     return <Text style={styles.customDay}>{day.getDay()}</Text>;
  //   }
  //   return <View style={styles.dayItem} />;
  // };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text>{item.name}</Text>
        <Text>Time: {item.time}</Text>
        <Text>Location: {item.location}</Text>
        <Text>{item.endDate}</Text>

        {item.notes !== null && (
          <Button
            style={styles.button}
            title="View Details"
            onPress={() => viewDetails(item)}
          />
        )}
      </View>
    );
  };
  // const renderEmptyDate = (item) => {
  //   return (
  //     <View style={styles.item}>
  //       <Text>No dates</Text>
  //     </View>
  //   );
  // };

  // const renderItem = (item) => (
  //   <View style={styles.item}>
  //     <Text>{item.name}</Text>
  //     {item.notes !== null && (
  //       <Button
  //         title="View Details"
  //         onPress={() => viewDetails(item)}
  //       />
  //     )}
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <Agenda
        items={events}
        onDayPress={(day) => console.log(day)}
        renderItem={renderItem}
        // renderEmptyDate={renderEmptyDate}
        renderEmptyData={() => {
          return null;
        }}
        showOnlySelectedDayItems={true}
        refreshing={false}
        showClosingKnob={true}
      />
      <StatusBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  button: {},
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});

export default CalendarUI;
