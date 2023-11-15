const Account = require("../models/AccountModel");
const { JOB_STATUS } = require("../enum/JobStatus");
const { ACCOUNT_TYPE } = require("../enum/AccountType");
const { SERVICE_STATUS } = require("../enum/ServiceStatus");

const getRegisteredJobs = async (req, res) => {
  try {
    console.log("Attempting to fetch all registered jobs...");
    const { id: accountId } = req.params;

    const registeredJobListings = await Account.aggregate([
      { $unwind: "$job" },
      {
        $match: {
          $and: [
            { "job.status": JOB_STATUS.REGISTERED },
            { "job.progress": { $ne: SERVICE_STATUS.PAID } },
            { "job.jobSeekerId": accountId },
          ],
        },
      },
      {
        $project: {
          jobId: "$job._id",
          serviceId: "$job.serviceId",
          recipientId: "$_id",
          title: "$job.title",
          subtitle: "$job.subtitle",
        },
      },
    ]);

    console.log(registeredJobListings);

    // registeredJobListings =
    if (registeredJobListings.length < 1) {
      return res
        .status(400)
        .json({ success: false, body: "No Registered Job Listings found!" });
    }

    console.log("Registered Job Listings found!");
    return res.status(200).json({ success: true, body: registeredJobListings });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    console.log("Attempting to fetch all jobs...");

    const jobListings = await Account.aggregate([
      { $unwind: "$job" },
      { $match: { "job.status": JOB_STATUS.AVAILABLE } },
      {
        $project: {
          jobId: "$job._id",
          serviceId: "$job.serviceId",
          jobSeekerId: "$job.jobSeekerId",
          title: "$job.title",
          subtitle: "$job.subtitle",
        },
      },
    ]);

    if (!jobListings) {
      return res
        .status(400)
        .json({ success: false, body: "No Job Listings found!" });
    }

    console.log(jobListings);
    return res.status(200).json({ success: true, body: jobListings });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

// Define the acceptJob function
const acceptJob = async (req, res) => {
  try {
    const { accountId, jobId } = req.body;

    console.log(accountId, jobId);
    const jobSeekerList = await Account.find({
      _id: { $eq: accountId },
    });

    if (jobSeekerList.length < 1) {
      return res.status(400).json({
        success: false,
        body: "No account found.",
      });
    }

    const jobSeeker = jobSeekerList[0];
    if (jobSeeker.type !== ACCOUNT_TYPE.JOBSEEKER) {
      return res.status(400).json({
        success: false,
        body: "Invalid account type. User is not a Job Seeker.",
      });
    }
    console.log("Valid Job Seeker.");

    const acceptedJob = await Account.findOneAndUpdate(
      { "job._id": jobId },
      {
        $set: {
          "job.$.status": JOB_STATUS.REGISTERED,
          "job.$.jobSeekerId": accountId,
        },
      },
      {
        returnDocument: "after",
      }
    );
    console.log(acceptedJob);

    if (!acceptedJob) {
      return res.status(400).json({
        success: false,
        body: "Failed to accept job.",
      });
    }

    return res.status(200).json({
      success: true,
      body: "Job accepted successfully",
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const withdrawJob = async (req, res) => {
  try {
    const { accountId, jobId } = req.body;
    const jobSeekerList = await Account.find({
      _id: { $eq: accountId },
    });

    if (jobSeekerList.length < 1) {
      return res.status(400).json({
        success: false,
        body: "No account found.",
      });
    }

    // const jobSeeker = jobSeekerList[0];
    // if (jobSeeker.type !== ACCOUNT_TYPE.JOBSEEKER) {
    //   return res.status(400).json({
    //     success: false,
    //     body: "Invalid account type. User is not a Job Seeker.",
    //   });
    // }
    // console.log("Valid Job Seeker.");

    const withdrawnJob = await Account.findOneAndUpdate(
      { "job._id": jobId },
      {
        $set: {
          "job.$.status": JOB_STATUS.AVAILABLE,
          "job.$.jobSeekerId": "",
        },
      },
      {
        returnDocument: "after",
      }
    );
    console.log(withdrawnJob);

    if (!withdrawnJob) {
      return res.status(400).json({
        success: false,
        body: "Failed to withdraw job.",
      });
    }

    console.log("Job has been withdrawn!");

    return res.status(200).json({
      success: true,
      body: "Job successfully withdrawn.",
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  acceptJob,
  withdrawJob,
  getAllJobs,
  getRegisteredJobs,
};
