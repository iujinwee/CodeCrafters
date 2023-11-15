import { localhost } from "@src/components/root";

const postCreateService = async (info) => {
  const { accountId, ...rest } = info;

  console.log(
    `Calling API to create service at: ${localhost}/api/service/create/${accountId}`
  );

  return fetch(`${localhost}/api/service/create/${accountId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
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
export default postCreateService;
