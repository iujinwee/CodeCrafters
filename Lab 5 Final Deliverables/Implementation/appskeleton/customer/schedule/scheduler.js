import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import BaseButton from "@src/components/utils/button";
import BaseInput from "@src/components/utils/inputbox";
import LandingIcon from "@src/assets/splash/LandingLogo.png";
import DateFormat from "@src/components/utils/dateformat";
import TimeFormat from "@src/components/utils/timeformat";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import ErrorAlert from "@src/components/utils/erroralert";
import { Modal } from "native-base";
import postCreateService from "@src/api/service/postCreateService";
import * as SecureStore from "expo-secure-store";

const SchedulerUI = () => {
  
};

export default SchedulerUI;
