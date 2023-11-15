import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BaseButton from "@src/components/utils/button";
import TextDisplay from "@src/components/utils/textdisplay";
import { Modal, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import ErrorAlert from "@src/components/utils/erroralert";
import getServiceInfo from "@src/api/service/getServiceInfo";
import postAcceptJob from "@src/api/job/postAcceptJob";
import * as SecureStore from "expo-secure-store";

const router = useRouter();

const ViewMovingJobUI = () => {
  
};

export default ViewMovingJobUI;
