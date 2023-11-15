import { localhost } from "@src/components/root";

const getServiceInfo = async (id) => {
  return fetch(`${localhost}/api/service/get/${id}`, {
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
export default getServiceInfo;
