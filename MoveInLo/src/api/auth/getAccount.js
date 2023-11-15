import { localhost } from "@src/components/root";

const getAccount = async (req) => {
  const { email, type } = req;
  return fetch(`${localhost}/api/auth/get?email=${email}&type=${type}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.log("Error during get account.");
      throw error;
    });
};
export default getAccount;
