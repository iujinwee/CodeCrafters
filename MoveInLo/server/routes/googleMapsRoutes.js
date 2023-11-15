const express = require("express");
const GoogleMapsController = require("../controllers/GoogleMapController");
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/maps/search/:address", GoogleMapsController.findLocation);

router.post("/maps/coordinates", GoogleMapsController.reverseGeocoding);

module.exports = router;
