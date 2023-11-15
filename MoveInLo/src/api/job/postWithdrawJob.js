import { localhost } from "@src/components/root";

const postWithdrawJob = async (req) => {
  return fetch(`${localhost}/api/jobseeker/withdraw`, {
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
    .then((json) => {
      return json;
    })
    .catch((error) => {
      throw error;
    });
};
export default postWithdrawJob;
