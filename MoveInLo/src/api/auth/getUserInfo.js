import { localhost } from "@src/components/root";

const getUserInfo = async (accountId) => {
  return fetch(`${localhost}/api/auth/account/${accountId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      throw error;
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      throw error;
    });
};
export default getUserInfo;
