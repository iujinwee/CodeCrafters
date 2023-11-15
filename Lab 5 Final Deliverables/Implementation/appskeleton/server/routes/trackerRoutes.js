const express = require("express");
const ProgressManager = require("../controllers/ProgressManager");
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/progress/job/:id", ProgressManager.getProgress);

router.put("/progress/collection", ProgressManager.updateCollection);

router.put("/progress/delivered", ProgressManager.updateDelivered);

router.put("/progress/paid", ProgressManager.updatePaid);

module.exports = router;
