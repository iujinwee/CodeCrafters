import { localhost } from "@src/components/root";

const getJobListings = async (info) => {
  return fetch(`${localhost}/api/jobseeker/jobs`, {
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
export default getJobListings;
