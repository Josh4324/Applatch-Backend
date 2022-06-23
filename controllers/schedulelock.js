const UserService = require("../services/user");
const ScheduleLockService = require("../services/schedulelock");
const ScheduleLockDaysService = require("../services/schedulelockdays");
const ScheduleLockAppsService = require("../services/schedulelockapps");
const MailService = require("../services/mail");
const argon2 = require("argon2");
const { Response, Token } = require("../helpers");
const { v4: uuidv4 } = require("uuid");
const front = "https://applatch.com/";
const random = require("random");

const userService = new UserService();
const scheduleLockService = new ScheduleLockService();
const scheduleLockDaysService = new ScheduleLockDaysService();
const scheduleLockAppsService = new ScheduleLockAppsService();
const mailService = new MailService();
const token = new Token();

exports.createScheduleLock = async (req, res) => {
  try {
    const { id } = req.payload;
    req.body.userId = id;
    req.body.status = "ongoing";

    const { social } = req.body;

    const lockCheck = await scheduleLockService.findScheduleLockWithUserId(id);

    if (lockCheck) {
      const response = new Response(true, 409, "Lock session in progress");
      return res.status(response.code).json(response);
    }

    const lock = await scheduleLockService.createScheduleLock(req.body);

    if (social || social?.length > 0) {
      const allapps = await scheduleLockAppsService.findApps(lock.id);
      for (let i = 0; i < social.length; i++) {
        if (
          social[i].status === false &&
          allapps.filter((item) => item.packageName === social[i].packageName)
            .length === 1
        ) {
          await scheduleLockAppsService.deleteApp(
            lock.id,
            social[i].packageName
          );
        }

        if (
          social[i].status === true &&
          allapps.filter((item) => item.packageName === social[i].packageName)
            .length === 0
        ) {
          await scheduleLockAppsService.createApp({
            name: social[i].name,
            scheduleId: lock.id,
            packageName: social[i].packageName,
            icon: social[i].icon,
            status: true,
          });
        }
      }
    }

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
        await scheduleLockDaysService.createScheduleLockDays({
          day: item,
          scheduleId: lock.id,
        });
      });
    }

    if (req.body.repeat === false) {
      const days = req.body.days;
      days.map(async (item) => {
        await scheduleLockDaysService.createScheduleLockDays({
          day: item,
          scheduleId: lock.id,
        });
      });
    }

    const response = new Response(
      true,
      201,
      "Schedule Lock created successfully",
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

exports.updateScheduleLock = async (req, res) => {
  try {
    const { id } = req.payload;

    const { status } = req.body;

    const lock = await scheduleLockService.findScheduleLockWithUserId(id);

    if (status === "pause" || (status === "end" && lock !== null)) {
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

      await scheduleLockService.updateScheduleLock(lock.id, { status });
    }

    if (status === "ongoing" && lock !== null) {
      await scheduleLockService.updateScheduleLock(lock.id, {
        status,
        pause_verify: false,
      });
    }

    if (status === "complete" && lock !== null) {
      await scheduleLockService.updateScheduleLock(lock.id, {
        status,
        end_verify: true,
      });
    }

    const lockData = await scheduleLockService.findScheduleLockWithUserId(id);

    const response = new Response(
      true,
      200,
      "Schedule Lock updated successfully",
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

exports.verifyScheduleLockService = async (req, res) => {
  try {
    const { id } = req.payload;

    const { code, status } = req.body;

    const user = await userService.findUserWithId(id);

    if (user.code !== code) {
      const response = new Response(true, 409, "Invalid code");
      return res.status(response.code).json(response);
    }

    const lock = await scheduleLockService.findScheduleLockWithUserId(id);

    const pausePayload = {
      pause_verify: true,
    };

    const endPayload = {
      end_verify: true,
    };

    if (status === "pause") {
      await scheduleLockService.updateScheduleLock(lock.id, pausePayload);
    }

    if (status === "end") {
      await scheduleLockService.updateScheduleLock(lock.id, endPayload);
    }

    const lockData = await scheduleLockService.findScheduleLockWithUserId(id);

    const response = new Response(
      true,
      200,
      "Verification Successful",
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
