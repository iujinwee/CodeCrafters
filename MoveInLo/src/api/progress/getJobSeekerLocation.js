import { localhost } from "@src/components/root";

const getJobSeekerLocation = async (jobseekerId) => {
  return fetch(`${localhost}/api/progress/getlocation/${jobseekerId}`, {
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
export default getJobSeekerLocation;
