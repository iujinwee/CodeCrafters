const Account = require("../models/AccountModel");
const { JOB_STATUS } = require("../enum/JobStatus");
const { ACCOUNT_TYPE } = require("../enum/AccountType");
const { SERVICE_STATUS } = require("../enum/ServiceStatus");

const getRegisteredJobs = async (req, res) => {
 
};

const getAllJobs = async (req, res) => {

};

// Define the acceptJob function
const acceptJob = async (req, res) => {

};

const withdrawJob = async (req, res) => {
  
};

module.exports = {
  acceptJob,
  withdrawJob,
  getAllJobs,
  getRegisteredJobs,
};
