const UserService = require("../services/user");
const LockDailyService = require("../services/lockdaily");
const LockDailyDaysService = require("../services/lockdailydays");
const MailService = require("../services/mail");
const argon2 = require("argon2");
const { Response, Token } = require("../helpers");
const { v4: uuidv4 } = require("uuid");
const front = "https://applatch.com/";
const random = require("random");

const userService = new UserService();
const lockDailyService = new LockDailyService();
const lockDailyDaysService = new LockDailyDaysService();
const mailService = new MailService();
const token = new Token();

exports.createLockDaily = async (req, res) => {
  try {
    const { id } = req.payload;
    req.body.userId = id;
    req.body.status = "ongoing";

    const lockCheck = await lockDailyService.findLockDailyWithUserId(id);

    if (lockCheck) {
      const response = new Response(true, 409, "Lock session in progress");
      return res.status(response.code).json(response);
    }

    const lock = await lockDailyService.createLockDaily(req.body);

    if (req.body.repeat === true) {
      const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      days.map(async (item) => {
        await lockDailyDaysService.createLockDailyDays({
          day: item,
          lockDailyId: lock.id,
        });
      });
    }

    if (req.body.repeat === false) {
      const days = req.body.days;
      days.map(async (item) => {
        await lockDailyDaysService.createLockDailyDays({
          day: item,
          lockDailyId: lock.id,
        });
      });
    }

    const response = new Response(
      true,
      201,
      "Daily Lock created successfully",
      lock
    );
    return res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    const response = new Response(
      false,
      500,
      "An error ocurred, please try again",
      err
    );
    return res.status(response.code).json(response);
  }
};

exports.updateLockDaily = async (req, res) => {
  try {
    const { id } = req.payload;

    const { status } = req.body;

    const lock = await lockDailyService.findLockDailyWithUserId(id);

    if (status === "pause" || status === "end") {
      const code = random.int(1000, 9999);

      req.body.code = code;

      await userService.updateUser(id, req.body);

      const userData = await userService.findUserWithId(id);

      // send verification mail
      const mail = await mailService.sendAccountabilityPartnerMail(
        userData.firstName,
        userData.partner_email,
        code
      );

      await lockDailyService.updateLockDaily(lock.id, { status });
    }

    if (status === "ongoing") {
      await lockDailyService.updateLockDaily(lock.id, {
        status,
        pause_verify: false,
      });
    }

    if (status === "complete") {
      await lockDailyService.updateLockDaily(lock.id, {
        status,
        end_verify: true,
      });
    }

    const lockData = await lockDailyService.findLockDailyWithUserId(id);

    const response = new Response(
      true,
      200,
      "Lock Daily updated successfully",
      lockData
    );

    res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    const response = new Response(
      false,
      500,
      "An error ocurred, please try again",
      err
    );
    res.status(response.code).json(response);
  }
};

exports.verifyLockDaily = async (req, res) => {
  try {
    const { id } = req.payload;

    const { code, status } = req.body;

    const user = await userService.findUserWithId(id);

    if (user.code !== code) {
      const response = new Response(true, 409, "Invalid code");
      return res.status(response.code).json(response);
    }

    const lock = await lockDailyService.findLockDailyWithUserId(id);

    const pausePayload = {
      pause_verify: true,
    };

    const endPayload = {
      end_verify: true,
    };

    if (status === "pause") {
      await lockDailyService.updateLockDaily(lock.id, pausePayload);
    }

    if (status === "end") {
      await lockDailyService.updateLockDaily(lock.id, endPayload);
    }

    const lockData = await lockDailyService.findLockDailyWithUserId(id);

    const response = new Response(
      true,
      200,
      "Verification Successful",
      lockData
    );
    res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    // redirect user to token invalid or expired page
    const response = new Response(
      false,
      500,
      "An error ocurred, please try again",
      err
    );
    res.status(response.code).json(response);
  }
};
