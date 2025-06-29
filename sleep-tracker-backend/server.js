// server.js

// Load environment variables from .env file (safely and early)
import dotenv from "dotenv";
dotenv.config(); 

// Import the express app instance
import app from "./src/app.js";

// Set port from environment or default to 8000
const PORT = process.env.PORT || 8000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});