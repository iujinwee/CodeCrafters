const mongoose = require("mongoose");
const { username, password, cluster, name } = require("../config");
const connectDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(
      `mongodb+srv://${username}:${password}@${cluster}.03plysc.mongodb.net/${name}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB connected: ${connection.host}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = { connectDatabase };
