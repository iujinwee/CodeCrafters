import React, { useState } from "react";
import { Modal } from "native-base";
import { Screen } from "react-native-screens";
import { Text, View, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuestionIcon from "@src/assets/splash/QuestionIcon.png";
import BaseButton from "@src/components/utils/button";
import postWithdrawJob from "@src/api/job/postWithdrawJob";
import ErrorAlert from "@src/components/utils/erroralert";

const router = useRouter();

const JobWithdrawalRequestUI = () => {
  
};

export default JobWithdrawalRequestUI;
