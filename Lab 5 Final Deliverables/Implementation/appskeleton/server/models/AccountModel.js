const mongoose = require("mongoose");
const ServiceSchema = require("./ServiceModel");
const JobSchema = require("./JobModel");
const { ACCOUNT_TYPE } = require("../enum/AccountType");

const AccountSchema = new mongoose.Schema({

});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
