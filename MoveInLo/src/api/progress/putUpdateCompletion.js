import { localhost } from "@src/components/root";

const putUpdateCompletion = async (jobID) => {
  const reqdata = jobID;
  return fetch(`${localhost}/api/progress/completion/${jobID}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqdata),
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
export default putUpdateCompletion;
