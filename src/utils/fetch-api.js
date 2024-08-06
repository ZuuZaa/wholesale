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
  console.log(JSON.parse(data.output));
  return JSON.parse(data.output);
};



//   const fetchData = async () => {
//     let status;
//     let fav_data = [];

//     const fetchData = async () => {
//       let token = "";
//       if (typeof localStorage !== "undefined") {
//         token = localStorage.getItem("jwtToken");
//       }
//       let response = await fetch(
//         `https://api.wscshop.co.uk/api/profile/get-index`,
//         {
//           method: "GET",
//           dataType: "json",
//           headers: {
//             Accept: "application/json, text/plain",
//             "Content-Type": "application/json;charset=UTF-8",
//             Authorization: "Bearer " + token,
//           },
//         }
//       );
//       const resp = await response.json();
//       status = resp.status;
//       fav_data = resp.output;
//       //return resp.output;
//     };

//     await fetchData();

//     if (status === 401) {
//       try {
//         let token = "";
//         let refreshToken = "";
//         if (typeof localStorage !== "undefined") {
//           token = localStorage.getItem("jwtToken");
//           refreshToken = localStorage.getItem("refreshToken");
//         }
//         console.log(token);
//         console.log(refreshToken);
//         let response = await fetch(
//           `https://api.wscshop.co.uk/api/account/refresh-token?userRefreshToken=${refreshToken}`,
//           {
//             method: "POST",
//             dataType: "json",
//             headers: {
//               Accept: "application/json, text/plain",
//               "Content-Type": "application/json;charset=UTF-8",
//               Authorization: "Bearer " + token,
//             },
//           }
//         );
//         const resp = await response.json();

//         if (resp.status !== 400) {
//           if (typeof localStorage !== "undefined") {
//             localStorage.setItem("refreshToken", resp.output.refreshToken);
//             localStorage.setItem("jwtToken", resp.output.token);
//           }

//           await fetchData();
//         } else {
//           if (typeof window !== "undefined") {
//             window.location.href = "/login";
//           }
//           //go to login page
//           //alert(1)
//         }
//       } catch {
//         console.log("error");
//       }
//     } else {
//       return fav_data;
//     }
//   };