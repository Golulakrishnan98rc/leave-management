const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const leaveRoutes = require("./routes/leaveRoutes.js");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
