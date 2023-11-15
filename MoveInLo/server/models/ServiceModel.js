const mongoose = require("mongoose");
const { SERVICE_TYPE } = require("../enum/ServiceType");

const ServiceSchema = new mongoose.Schema({
  collectionDate: {
    type: String,
    require: true,
  },
  collectionTime: {
    type: String,
    require: true,
  },
  collectionAddress: {
    type: String,
    require: true,
  },
  deliveryDate: {
    type: String,
    require: true,
  },
  deliveryTime: {
    type: String,
    require: true,
  },
  deliveryAddress: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    enum: [SERVICE_TYPE.MOVEIN, SERVICE_TYPE.MOVEOUT],
    default: SERVICE_TYPE.MOVEIN,
  },
});

module.exports = ServiceSchema;
