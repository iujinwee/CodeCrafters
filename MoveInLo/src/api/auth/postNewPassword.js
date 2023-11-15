import { localhost } from "@src/components/root";

const postNewPassword = async (req) => {
  const { id, body } = req;
  return fetch(`${localhost}/api/auth/update/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newPassword: body.newPassword,
    }),
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
export default postNewPassword;
