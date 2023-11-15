const mongoose = require("mongoose");
const { JOB_STATUS } = require("../enum/JobStatus");
const { SERVICE_STATUS } = require("../enum/ServiceStatus");

const JobSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
  },
  jobSeekerId: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [JOB_STATUS.AVAILABLE, JOB_STATUS.REGISTERED],
    default: JOB_STATUS.AVAILABLE,
  },
  progress: {
    type: String,
    enum: [
      SERVICE_STATUS.PENDING,
      SERVICE_STATUS.PROGRESS,
      SERVICE_STATUS.DELIVERED,
    ],
    default: SERVICE_STATUS.PENDING,
  },
});

module.exports = JobSchema;
