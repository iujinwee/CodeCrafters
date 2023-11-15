const express = require("express");
const cors = require("cors");
const Auth = require("./routes/authRoutes");
const JobSeeker = require("./routes/jobRoutes");
const ServiceScheduler = require("./routes/schedulerRoutes");
const ProgressTracker = require("./routes/trackerRoutes");
const GoogleMapController = require("./routes/googleMapsRoutes");
const Calendar = require("./routes/calendarRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Add new routes here
app.use("/api/", Auth);
app.use("/api/", JobSeeker);
app.use("/api/", ServiceScheduler);
app.use("/api/", ProgressTracker);
app.use("/api/", GoogleMapController);
app.use("/api/", Calendar);

app.get("/", (req, res) => {
  res.send("Server is running");
});

module.exports = app;
