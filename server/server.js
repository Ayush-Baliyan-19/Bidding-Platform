require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Bidding Platform API Running"));

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const bidRoutes = require("./routes/bids");
app.use("/bids", bidRoutes);

const dealRoutes = require("./routes/deals");
app.use("/deals", dealRoutes);

const transporterRoutes = require("./routes/transporters");
app.use("/transporters", transporterRoutes);

const analyticsRoutes = require("./routes/analytics");
app.use("/analytics", analyticsRoutes);


// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
