import { localhost } from "@src/components/root";

const postLoginAccount = async (req) => {
  console.log(localhost);
  return fetch(`${localhost}/api/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
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
      console.log("Error when fetching POST Login");
      throw error;
    });
};
export default postLoginAccount;
