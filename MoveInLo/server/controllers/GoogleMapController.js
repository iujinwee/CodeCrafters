const { GOOGLE_MAPS_API_KEY } = require("../config");

const findLocation = async (req, res) => {
  try {
    console.log("Attempting to retrieve google maps location.");

    const { address } = req.params;

    const processedAddress = address.toLowerCase().replaceAll(" ", "%20");

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${processedAddress}&bounds=1.1304753,103.6920359%7C1.4504753,104.0120359&key=${GOOGLE_MAPS_API_KEY}`
    );

    const responseJson = await response.json();

    if (responseJson.status === "OK") {
      const geometry = responseJson.results[0].geometry;

      console.log("Successfully obtained location.");
      return res.status(200).json({ success: true, body: geometry.location });
    }

    if (responseJson.status === "ZERO_RESULTS") {
      return res.status(400).json({
        success: false,
        body: "No results found, try providing more information.",
      });
    }

    return res
      .status(400)
      .json({ success: false, body: "No valid google maps address found." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, body: "Invalid findLocation call." });
  }
};

const reverseGeocoding = async (req, res) => {
  try {
    console.log("Attempting to translate latlng to place name");
    const { latitude, longitude } = req.body;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&location_type=ROOFTOP&result_type=street_address&key=${GOOGLE_MAPS_API_KEY}`
    );

    const responseJson = await response.json();

    if (responseJson.status === "OK") {
      console.log("Successfully obtained location.");
      return res.status(200).json({
        success: true,
        body: responseJson.results[0].formatted_address,
      });
    }

    return res.status(400).json({
      success: false,
      body: "Please change your marker to another location.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, body: "Invalid reverseGeocoding call." });
  }
};

module.exports = { findLocation, reverseGeocoding };
