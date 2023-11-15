import { localhost } from "@src/components/root";

const putUpdateDelivered = async (req) => {
  return fetch(`${localhost}/api/progress/delivered`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      throw error;
    });
};
export default putUpdateDelivered;
