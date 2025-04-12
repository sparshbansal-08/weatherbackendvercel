const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const weatherRoutes = require("./routes/weather");

const envPath = require("path").resolve(__dirname, ".env");
console.log("Looking for .env at:", envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error loading .env:", result.error);
} else {
  console.log(".env loaded successfully");
}

console.log("Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("OPENWEATHER_API_KEY:", process.env.OPENWEATHER_API_KEY);

const app = express();

const corsOptions = {
  origin: [
    "https://spectacular-bavarois-246ebb.netlify.app/",
    "http://localhost:3000", // Allow local development
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
  res.send("Weather API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
