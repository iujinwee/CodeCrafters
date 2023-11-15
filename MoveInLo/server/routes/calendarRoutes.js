const express = require("express");
const router = express.Router();
const CalendarController = require("../controllers/CalendarController");

router.get("/calendar", CalendarController.authorizeCalendar);
router.get("/google/redirect", CalendarController.handleRedirect);
router.post("/calendar/create-event", CalendarController.createEvent);

module.exports = router;