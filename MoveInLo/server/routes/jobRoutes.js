const express = require("express");
const jobManagerController = require("../controllers/JobManager");

const router = express.Router();

router.get("/jobseeker/jobs", jobManagerController.getAllJobs);

router.get("/jobseeker/registered/:id", jobManagerController.getRegisteredJobs);

router.post("/jobseeker/accept", jobManagerController.acceptJob);

router.post("/jobseeker/withdraw", jobManagerController.withdrawJob);

module.exports = router;
