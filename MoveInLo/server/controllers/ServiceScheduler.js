const Account = require("../models/AccountModel");
const { SERVICE_STATUS } = require("../enum/ServiceStatus");
const { JOB_STATUS } = require("../enum/JobStatus");

const fetchServiceInfo = async (req, res) => {
  try {
    console.log("Attempting to fetch service info...");

    const { id } = req.params;

    const selectedService = await Account.findOne(
      { "service._id": id },
      {
        "service.$": true,
      }
    );

    // console.log(selectedService);

    if (!selectedService) {
      return res
        .status(400)
        .json({ success: false, body: "No Moving Service found!" });
    }

    const serviceInfo = selectedService.service;
    await console.log("Successfully found moving service.");
    return res.status(200).json({ success: true, body: { serviceInfo } });
  } catch (e) {
    return res.status(500).json({ success: false, body: e.message });
  }
};

const createServiceAndJob = async (req, res) => {
  try {
    console.log("Attempting to create a new service...");

    const { collectionDate, collectionTime, collectionAddress } = req.body;
    const { id } = req.params;

    const updatedService = await Account.findByIdAndUpdate(
      { _id: id },
      { $push: { service: req.body } },
      {
        returnDocument: "after",
      }
    );

    // console.log(updatedService);
    if (!updatedService) {
      return res
        .status(400)
        .json({ success: false, body: "Failed to create new service." });
    }

    const newServiceList = updatedService.service;
    const newServiceId = newServiceList[newServiceList.length - 1]._id;

    const updatedJob = await Account.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          job: {
            serviceId: newServiceId,
            title: collectionDate + ", " + collectionTime,
            subtitle: collectionAddress,
            status: JOB_STATUS.AVAILABLE,
            progress: SERVICE_STATUS.PENDING,
          },
        },
      },
      {
        returnDocument: "after",
      }
    );

    // console.log(updatedJob);
    if (!updatedJob) {
      return res
        .status(400)
        .json({ success: false, body: "Failed to create new job." });
    }

    // Retrieve id and pass as outputs
    const serviceList = updatedService.service;
    const serviceId = serviceList[serviceList.length - 1]._id;
    const jobList = updatedJob.job;
    const jobId = jobList[jobList.length - 1]._id;

    await console.log("Successfully created new service and job.");
    return res.status(200).json({ success: true, body: { serviceId, jobId } });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const withdrawService = async (req, res) => {
  try {
    console.log("Attempting to delete service...");
    const { accountId, serviceId, jobId } = req.body;

    const deleteService = await Account.updateOne(
      { _id: accountId },
      { $pull: { service: { _id: serviceId } } }
    );
    console.log(deleteService);

    if (!deleteService || !deleteService.modifiedCount) {
      return res
        .status(400)
        .json({ success: false, body: "Failed to delete service." });
    }
    console.log("Service deleted successfully.");

    const deleteJob = await Account.updateOne(
      { _id: accountId },
      { $pull: { job: { _id: jobId } } }
    );
    console.log(deleteJob);

    if (!deleteJob || !deleteJob.modifiedCount) {
      return res
        .status(400)
        .json({ success: false, body: "Failed to delete job" });
    }
    console.log("Job deleted successfully.");

    return res
      .status(200)
      .json({ success: true, body: "Job and Service successfully deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

module.exports = { fetchServiceInfo, createServiceAndJob, withdrawService };
