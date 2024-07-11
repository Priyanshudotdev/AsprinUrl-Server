import axios from "axios";

const response = axios
  .get("http://localhost:3000/api/v1/url/https://github.com")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
