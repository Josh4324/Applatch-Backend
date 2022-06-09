const UserService = require("../services/user");
const LockService = require("../services/lock");
const MailService = require("../services/mail");
const argon2 = require("argon2");
const { Response, Token } = require("../helpers");
const { v4: uuidv4 } = require("uuid");
const front = "https://applatch.com/";
const random = require("random");

const userService = new UserService();
const lockService = new LockService();
const mailService = new MailService();
const token = new Token();

exports.createLock = async (req, res) => {
  try {
    const { id } = req.payload;
    req.body.userId = id;
    req.body.status = "ongoing";

    const lockCheck = await lockService.findLockWithId(id);

    if (lockCheck) {
      const response = new Response(true, 409, "Lock session in progress");
      return res.status(response.code).json(response);
    }

    const lock = await lockService.createLock(req.body);

    const response = new Response(true, 201, "Lock created successfully", lock);
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

exports.updateLock = async (req, res) => {
  try {
    const { id } = req.payload;

    const { status } = req.body;

    const lock = await lockService.findLockWithId(id);

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

      await lockService.updateLock(lock.id, { status });
    }

    if (status === "ongoing") {
      await lockService.updateLock(lock.id, { status, pause_verify: false });
    }

    if (status === "complete") {
      await lockService.updateLock(lock.id, { status, end_verify: true });
    }

    const response = new Response(true, 200, "Lock updated successfully");

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

exports.verifyLock = async (req, res) => {
  try {
    const { id } = req.payload;

    const { code, status } = req.body;

    const user = await userService.findUserWithId(id);

    if (user.code !== code) {
      const response = new Response(true, 409, "Invalid code");
      return res.status(response.code).json(response);
    }

    const lock = await lockService.findLockWithId(id);

    const pausePayload = {
      pause_verify: true,
    };

    const endPayload = {
      end_verify: true,
    };

    if (status === "pause") {
      await lockService.updateLock(lock.id, pausePayload);
    }

    if (status === "end") {
      await lockService.updateLock(lock.id, endPayload);
    }

    const lockData = await lockService.findLockWithId(id);

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
