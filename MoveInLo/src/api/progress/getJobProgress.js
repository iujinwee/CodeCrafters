import { localhost } from "@src/components/root";

const getJobProgress = async (jobId) => {
  return fetch(`${localhost}/api/progress/job/${jobId}`, {
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
export default getJobProgress;
