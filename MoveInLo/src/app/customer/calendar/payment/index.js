import { Text, View, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Localization from "expo-localization";
import getServiceInfo from "@src/api/service/getServiceInfo";
import * as SecureStore from "expo-secure-store";
import * as XCalendar from "expo-calendar";
import React, { useEffect, useState } from "react";
import SuccessIcon from "@src/assets/splash/SuccessTickIcon.png";
import { parse } from "date-fns";

const PaymentUI = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [serviceInfo, setServiceInfo] = useState(null);
  const { notes } = useLocalSearchParams();


  const withdrawEvents = async () => {
    try {

      const accountId = await SecureStore.getItemAsync("accountId");
      const noteData = notes ? notes.split(",") : null;
      const serviceId = noteData[0];

      const retrievedService = await getServiceInfo(serviceId);
      setServiceInfo(retrievedService.body.serviceInfo[0]);

      let androidCalendar, iosCalendar;

      const { status } = await XCalendar.requestCalendarPermissionsAsync();
      console.log(status);

      const { timeZone } = Localization.getCalendars()[0];

      if (Platform.OS === "ios") {
        if (status === "granted") {
          // get default ios calendar
          iosCalendar = await XCalendar.getDefaultCalendarAsync(
            XCalendar.EntityTypes.EVENT
          );
          console.log(iosCalendar.id);

          const isoCollect = parse(
            `${serviceInfo.collectionDate} ${serviceInfo.collectionTime}`,
            "dd MMM yyyy h:mm a",
            new Date(),
            { timeZone }
          );
          console.log("iso", isoCollect);

          const isoDeliver = parse(
            `${serviceInfo.deliveryDate} ${serviceInfo.deliveryTime}`,
            "dd MMM yyyy h:mm a",
            new Date(),
            { timeZone }
          );
          console.log(isoDeliver);

          isoCollect.setDate(isoCollect.getDate() - 1);
          isoDeliver.setDate(isoDeliver.getDate() + 1);

          const eventsInRange = await XCalendar.getEventsAsync(
            [iosCalendar.id],
            isoCollect,
            isoDeliver
          );

          const filtered = eventsInRange.filter((event) => {
            return event.notes === notes;
          });

          console.log(filtered);
          for (const events of filtered) {
            await XCalendar.deleteEventAsync(events.id);
          }
          // console.log(iosCalendar);
        } else {
          console.log("Permission denied");
        }
      } else {
        if (status === "granted") {
          const androidCalendars = await XCalendar.getCalendarsAsync(
            XCalendar.EntityTypes.EVENT
          );
          androidCalendar = androidCalendars.find(
            (XCalendar) => XCalendar.isPrimary
          );
          console.log(androidCalendar);
        } else {
          console.log("Permission denied");
        }
      }
    } catch (e){
      console.log(e);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await withdrawEvents(notes);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    if (!appIsReady) {
      prepare();
    }
  });

  return (
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        flex: true,
        flexDirection: "column",
        display: "flex",
      }}
    >
      <View className={`flex flex-column`} style={{ alignItems: "center" }}>
        <Image source={SuccessIcon} />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          Payment Sent!
        </Text>
        <View className={"w-2/3"}>
          <Text
            className={"font-RobotoRegular"}
            style={{
              fontSize: 15,
              marginTop: 15,
              textAlign: "center",
            }}
          >
            Do notify the deliverer that you have transferred the payment!
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentUI;
