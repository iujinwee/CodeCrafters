import { localhost } from "@src/components/root";

const getCoordinates = async (info) => {
  return fetch(`${localhost}/api/maps/coordinates`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
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
export default getCoordinates;
