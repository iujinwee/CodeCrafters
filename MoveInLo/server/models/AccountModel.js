const mongoose = require("mongoose");
const ServiceSchema = require("./ServiceModel");
const JobSchema = require("./JobModel");
const { ACCOUNT_TYPE } = require("../enum/AccountType");

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  long: {
    type: Number,
  },
  lat: {
    type: Number,
  },
  age: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: [ACCOUNT_TYPE.CUSTOMER, ACCOUNT_TYPE.JOBSEEKER],
    default: ACCOUNT_TYPE.CUSTOMER,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  job: [JobSchema],
  service: [ServiceSchema],
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
