const Account = require("../models/AccountModel");
const { SERVICE_STATUS } = require("../enum/ServiceStatus");

const getProgress = async (req, res) => {
  try {
    console.log("Attempting to retrieve job progress...");
    const { id } = req.params;

    const progressList = await Account.find(
      { "job._id": id },
      { "job.$": true }
    );

    if (progressList.length < 1) {
      return res.status(400).json({
        success: false,
        body: "Failed to retrieve progress info.",
      });
    }

    const progressObject = progressList[0];
    const progressInfo = progressObject.job[0].progress;
    const jobSeekerId = progressObject.job[0].jobSeekerId;

    console.log("Successfully obtained job progress.");
    return res
      .status(200)
      .json({
        success: true,
        body: { progress: progressInfo, id: jobSeekerId },
      });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    console.log("Attempting to update current location.");

    const { accountId, location } = req.body;

    const updatedLocation = await Account.updateOne(
      { _id: accountId },
      { $set: { long: location.long, lat: location.lat } },
      { returnDocument: "after" }
    );

    if (!updatedLocation || !updatedLocation.modifiedCount) {
      return res.status(400).json({
        success: false,
        body: "Failed to update current location.",
      });
    }

    console.log("Successfully updated current location.");
    return res.status(200).json({ success: true, body: updatedLocation });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};


const getLocation = async (req, res) => {
  try {
    console.log("Attempting to get jobseeker location.");

    const { jobseekerId } = req.params;

    const getAccountLocation = await Account.findOne(
      { _id: jobseekerId },
      {long : true, lat : true}
    );

    if (!getAccountLocation) {
      return res.status(400).json({
        success: false,
        body: "Failed to get jobseeker current location.",
      });
    }

    console.log("Successfully get jobseeker current location.");
    return res.status(200).json({ success: true, body: getAccountLocation });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    console.log("Attempting to update job to 'In Progress'");

    const { jobId } = req.body;
    const updatedInProgress = await Account.updateOne(
      { "job._id": jobId },
      { $set: { "job.$.progress": SERVICE_STATUS.PROGRESS } },
      { returnDocument: "after" }
    );

    if (!updatedInProgress || !updatedInProgress.modifiedCount) {
      return res.status(400).json({
        success: false,
        body: "Failed to update job to 'In Progress'",
      });
    }

    console.log("Successfully updated to `In Progress`");
    return res.status(200).json({ success: true, body: updatedInProgress });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const updateDelivered = async (req, res) => {
  try {
    console.log("Attempting to update job to 'Delivered'");

    const { jobId } = req.body;
    const updatedDelivered = await Account.updateOne(
      { "job._id": jobId },
      { $set: { "job.$.progress": SERVICE_STATUS.DELIVERED } },
      { returnDocument: "after" }
    );

    if (!updatedDelivered || !updatedDelivered.modifiedCount) {
      return res.status(400).json({
        success: false,
        body: "Failed to update job to 'Delivered'",
      });
    }

    console.log("Successfully updated to `Delivered`");
    return res.status(200).json({ success: true, body: updatedDelivered });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const updatePaid = async (req, res) => {
  try {
    console.log("Attempting to update job to 'Paid'");

    const { jobId } = req.body;
    const updatedPaid = await Account.updateOne(
      { "job._id": jobId },
      { $set: { "job.$.progress": SERVICE_STATUS.PAID } },
      { returnDocument: "after" }
    );

    if (!updatedPaid || !updatedPaid.modifiedCount) {
      return res.status(400).json({
        success: false,
        body: "Failed to update job to 'Paid'",
      });
    }

    console.log("Successfully updated to `Paid`");
    return res.status(200).json({ success: true, body: updatedPaid });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

module.exports = {
  getProgress,
  updateLocation,
  updateCollection,
  updateDelivered,
  updatePaid,
  getLocation
};
