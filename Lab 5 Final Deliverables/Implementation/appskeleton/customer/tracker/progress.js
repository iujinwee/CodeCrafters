import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { SERVICE_STATUS } from "@server/enum/ServiceStatus";
import { router } from "expo-router";
import BaseButton from "@src/components/utils/button";
import LandingIcon from "@src/assets/splash/LandingLogo.png";
import TextDisplay from "@src/components/utils/textdisplay";
import * as SecureStore from "expo-secure-store";
import { Modal } from "native-base";
import ErrorAlert from "@src/components/utils/erroralert";

const ScheduledTrackerUI = () => {
  
};

export default ScheduledTrackerUI;
