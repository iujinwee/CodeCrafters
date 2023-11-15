const { google } = require("googleapis");
const { clientId, clientSecret, redirectUri } = require("../config");

const scopes = ['https://www.googleapis.com/auth/calendar'];
const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  )

  const authorizeCalendar = (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "online",
      scope: scopes,
    });
    // Redirect the user to the Google Calendar authorization URL
    res.redirect(authUrl);
  };

  const handleRedirect = async (req, res) => {
    const code = req.query.code;
    try {
      console.log("Received authorization code:", code);    
      // Exchange the code for an access token
      const tokenResponse = await oauth2Client.getToken(code);
  
      if (!tokenResponse.tokens || !tokenResponse.tokens.access_token) {
        // Log and respond to the error
        console.error("Access token not found in response:", tokenResponse);
        return res.status(500).json({ success: false, message: "Access token not found in response." });
      }
  
      const accessToken = tokenResponse.tokens.access_token;
      console.log("Access token received:", accessToken);
  
      // Set the credentials
      oauth2Client.setCredentials({
        access_token: accessToken,
      });
  
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      calendar.events.list(
        {
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime",
        },
        (err, response) => {
          if (err) {
            console.error("Error listing calendar events:", err);
            return res.status(500).json({ success: false, message: "Error occurred." });
          }
          const events = response.data.items;
          console.log("Calendar events received:", events);
          return res.json({ success: true, events });
        }
      );
    } catch (error) {
      console.error("Error exchanging the code for an access token:", error);
      return res.status(500).json({ success: false, message: "Error occurred.", error: error });
    }
  };
  
  const createEvent = async (req, res) => {
    // Event details from the request body
    const eventDetails = req.body;
  
    try {
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  
      const event = {
        summary: eventDetails.summary,
        location: eventDetails.location,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.startDateTime,
          timeZone: eventDetails.startTimezone,
        },
        end: {
          dateTime: eventDetails.endDateTime,
          timeZone: eventDetails.endTimezone,
        },
      };
  
      calendar.events.insert(
        {
          calendarId: "primary",
          resource: event,
        },
        (err, response) => {
          if (err) {
            console.error("Error creating calendar event:", err);
            return res.status(500).json({ success: false, message: "Error occurred." });
          }
          const createdEvent = response.data;
          return res.json({ success: true, event: createdEvent });
        }
      );
    } catch (error) {
      console.error("Error creating calendar event: " + error);
      return res.status(500).json({ success: false, message: "Error occurred." });
    }
  };

  module.exports = { authorizeCalendar, handleRedirect, createEvent };