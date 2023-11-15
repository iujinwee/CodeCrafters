import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { Modal } from "native-base";
import { Text, View } from "react-native";
import House from "@src/assets/splash/House.png";
import BaseRegisteredCard from "@src/components/utils/registeredcard";
import ErrorAlert from "@src/components/utils/erroralert";
import getRegisteredJobListings from "@src/api/job/getRegisteredJobListings";
import * as SecureStore from "expo-secure-store";

const RegisteredJobsUI = () => {
  
};

export default RegisteredJobsUI;
