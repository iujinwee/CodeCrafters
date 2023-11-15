import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Box,
  CheckIcon,
  FormControl,
  Select,
  WarningOutlineIcon,
} from "native-base";
import BaseButton from "@src/components/utils/button";
import BaseInput from "@src/components/utils/inputbox";
import ErrorAlert from "@src/components/utils/erroralert";
import postNewAccount from "@src/api/auth/postNewAccount";
import { ACCOUNT_TYPE } from "@server/enum/AccountType";
import * as SecureStore from "expo-secure-store";

const SignUpUI = () => {
};

export default SignUpUI;
