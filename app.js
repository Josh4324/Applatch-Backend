const express = require("express");
const Middleware = require("./middlewares/common");
require("dotenv").config();
const Response = require("./helpers/Response");

const userRoutes = require("./routes/user.js");
const lockRoutes = require("./routes/lock.js");
const beneficiaryRoutes = require("./routes/beneficiary");
const lockDailyRoutes = require("./routes/lockdaily");
const scheduleLockRoutes = require("./routes/schedulelock");
const scheduleModeRoutes = require("./routes/schedulemode");

const port = process.env.PORT || 3000;

const app = express();
Middleware(app);

//REGISTER ROUTES HERE
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/lock", lockRoutes);
app.use("/api/v1/lockdaily", lockDailyRoutes);
app.use("/api/v1/beneficiary", beneficiaryRoutes);
app.use("/api/v1/schedule", scheduleLockRoutes);
app.use("/api/v1/mode", scheduleModeRoutes);

app.get("/api", (req, res) => {
  const response = new Response(
    true,
    200,
    `Welcome to Applatch Backend ${port}`
  );
  res.status(response.code).json(response);
});

//Handling unhandle routes
app.all("*", (req, res, next) => {
  const response = new Response(
    false,
    404,
    `Page not found. Can't find ${req.originalUrl} on this server`
  );
  return res.status(response.code).json(response);
});

//listening to port
app.listen(port, () => {
  console.log(`Welcome to Applatch Backend running on port ${port}`);
});
