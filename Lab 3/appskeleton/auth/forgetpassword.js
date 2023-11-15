import { Text, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Box,
  Button,
  CheckIcon,
  Collapse,
  FormControl,
  HStack,
  Modal,
  Select,
  VStack,
} from "native-base";
import ErrorAlert from "@src/components/utils/erroralert";
import BaseInput from "@src/components/utils/inputbox";
import BaseButton from "@src/components/utils/button";
import getAccount from "@src/api/auth/getAccount";
import postNewPassword from "@src/api/auth/postNewPassword";
import { ACCOUNT_TYPE } from "@server/enum/AccountType";

const ForgetPasswordUI = () => {
  
};

export default ForgetPasswordUI;
