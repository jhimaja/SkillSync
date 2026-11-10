const mongoose = require("mongoose");

// This function connects our backend to MongoDB Atlas using Mongoose.
// Mongoose is a library that lets us talk to MongoDB using simple JavaScript code
// instead of writing raw database queries.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // If the database connection fails, there is no point running the server,
    // so we stop the whole application.
    process.exit(1);
  }
};

module.exports = connectDB;
