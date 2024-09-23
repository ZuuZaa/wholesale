import { API_URL, API_URL_AUTH } from "@/config/api";

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

let token = "";
let session_id = "";

if (typeof localStorage !== "undefined") {
  token = localStorage.getItem("jwtToken");
  session_id = localStorage.getItem("sessionId");

  if (session_id == null || session_id == "") {
    const value = uuidv4();
    localStorage.setItem("sessionId", value);
  }
}

export const fetchData = async (method, auth, details) => {
  const requestBody = JSON.stringify({
    UserId: 0,
    Method: method,
    Postcode: "",
    SessionId: session_id,
    ...details,
  });

  const url = auth ? API_URL_AUTH : API_URL;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Body: requestBody,
    }),
  });

  const data = await response.json();
  if (data.status === 401) {
    window.location.href = "/login";
  } else return JSON.parse(data.output);
};
