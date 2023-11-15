const app = require("./app");
const { connectDatabase } = require("./db/database");
const { port } = require("./config");

connectDatabase();

app.listen(port, () => {
  console.log("Starting up server...");
  // Perform a database connection when server starts
  console.log(`Server is running on port: ${port}`);
});
