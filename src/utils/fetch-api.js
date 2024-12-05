import { API_URL, API_URL_AUTH } from "@/config/api";
import { uuidv4 } from "@/helpers";

let token = "";
let session_id = "";
let customer_id = "";

if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("jwtToken");
  session_id = localStorage.getItem("sessionId");
  customer_id = localStorage.getItem("customerId");

  if (session_id == null || session_id == "") {
    const value = uuidv4();
    localStorage.setItem("sessionId", value);
  }
}

export const fetchData = async (method, auth, details) => {
  const requestBody = JSON.stringify({
    Body: JSON.stringify({
      UserId: 0,
      CustomerId: customer_id,
      Method: method,
      Postcode: "",
      SessionId: session_id,
      ...details,
    }),
  });

  const url = auth ? API_URL_AUTH : API_URL;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: requestBody,
  });

  const data = await response.json();
  console.log("response", data);
  if (data.status === 401) {
    window.location.href = "/login";
  } else return JSON.parse(data.output);
};
