import { localhost } from "@src/components/root";

const getLocation = async (info) => {
  return fetch(`${localhost}/api/maps/search/${info}`, {
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
export default getLocation;

// import { GOOGLE_MAPS_API_KEY } from "@src/components/root";
// export const findLocation = async (req) => {
//   try {
//     console.log("Attempting to retrieve google maps location.");
//
//     const processedInput = req.input.toLowerCase().replaceAll(" ", "%20");
//
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?address=${processedInput}&bounds=1.1304753,103.6920359%7C1.4504753,104.0120359&key=${GOOGLE_MAPS_API_KEY}`
//     );
//
//     if (response.ok) {
//       const responseJson = await response.json();
//
//       if (responseJson.status === "ZERO_RESULTS") {
//         return {
//           success: false,
//           body: "No results found, try providing more information.",
//         };
//       }
//
//       const geometry = responseJson.results[0].geometry;
//
//       console.log("Successfully obtained location.");
//       return { success: true, body: geometry.location };
//     } else {
//       return { success: false, body: "Invalid API response." };
//     }
//   } catch (error) {
//     return { success: false, body: "Invalid findLocation call." };
//   }
// };
