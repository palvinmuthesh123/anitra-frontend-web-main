import axios from "axios";
// import axios from "../utilities/axiosConfig";
import { BACKEND_API_URL } from "../utilities/constants";

function postHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers":
      "Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  };
}

export const apiRequest = (config = {}, headers = {}) => {
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  console.log(user, "UUUUUUUUUUUUUUUU")
  let configObj = {
    ...config,
    headers: {
      ...(!headers.isFileUpload && {
        ...postHeaders(),
      }),
      ...(user?.data && {
        Authorization: `Bearer ${user?.data}`,
      }),
    },
    url: BACKEND_API_URL + "/" + config.url,
  };

  return new Promise((resolve, reject) => {
    axios(configObj)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (err) {
        if (err?.response) {
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            // alert("Something went wrong !");
            // Unauthorized or Forbidden
            // window.location.href = "/login"; // Navigate to the login page
          }
        }
        reject(err);
      });
  });
};
