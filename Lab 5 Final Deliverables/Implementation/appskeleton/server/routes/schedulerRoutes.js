const express = require("express");
const serviceSchedulerController = require("../controllers/ServiceScheduler");
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/service/get/:id", serviceSchedulerController.fetchServiceInfo);

router.post(
  "/service/create/:id",
  serviceSchedulerController.createServiceAndJob
);

router.post("/service/withdraw", serviceSchedulerController.withdrawService);

module.exports = router;
