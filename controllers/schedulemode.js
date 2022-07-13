const UserService = require("../services/user");
const ScheduleModeService = require("../services/schedulemode");
const ScheduleModeDaysService = require("../services/schedulemodedays");
const ScheduleModeAppsService = require("../services/schedulemodeapps");
const MailService = require("../services/mail");
const argon2 = require("argon2");
const { Response, Token } = require("../helpers");
const { v4: uuidv4 } = require("uuid");
const front = "https://applatch.com/";
const random = require("random");

const userService = new UserService();
const scheduleModeService = new ScheduleModeService();
const scheduleModeDaysService = new ScheduleModeDaysService();
const scheduleModeAppsService = new ScheduleModeAppsService();
const mailService = new MailService();
const token = new Token();

exports.createScheduleMode = async (req, res) => {
  try {
    const { id } = req.payload;
    req.body.userId = id;

    const { social } = req.body;

    const lock = await scheduleModeService.createScheduleMode(req.body);

    if (social || social?.length > 0) {
      for (let i = 0; i < social.length; i++) {
        await scheduleModeAppsService.createApp({
          name: social[i].name,
          scheduleModeId: lock.id,
          packageName: social[i].packageName,
          icon: social[i].icon,
          status: true,
        });
      }
    }

    const days = req.body.days;
    days.map(async (item) => {
      await scheduleModeDaysService.createScheduleModeDays({
        day: item.day,
        scheduleModeId: lock.id,
        status: true,
      });
    });

    const response = new Response(
      true,
      201,
      "Schedule Mode created successfully",
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

exports.updateScheduleMode = async (req, res) => {
  try {
    const { id } = req.payload;

    const { lockModeId, social, days } = req.body;

    const lock = await scheduleModeService.findScheduleModeWithId(lockModeId);

    if (social || social?.length > 0) {
      const allapps = await scheduleModeAppsService.findApps(lockModeId);
      for (let i = 0; i < social.length; i++) {
        if (
          social[i].status === false &&
          allapps.filter((item) => item.packageName === social[i].packageName)
            .length === 1
        ) {
          await scheduleModeAppsService.deleteApp(
            lockModeId,
            social[i].packageName
          );
        }

        if (
          social[i].status === true &&
          allapps.filter((item) => item.packageName === social[i].packageName)
            .length === 0
        ) {
          await scheduleModeAppsService.createApp({
            name: social[i].name,
            scheduleModeId: lockModeId,
            packageName: social[i].packageName,
            icon: social[i].icon,
            status: true,
          });
        }
      }
    }

    if (days || days?.length > 0) {
      const alldays = await scheduleModeDaysService.findDays(lockModeId);
      for (let i = 0; i < days.length; i++) {
        if (
          days[i].status === false &&
          alldays.filter((item) => item.day === days[i].day).length === 1
        ) {
          await scheduleModeDaysService.deleteDay(lock.id, days[i].day);
        }

        if (
          days[i].status === true &&
          alldays.filter((item) => item.day === days[i].day).length === 0
        ) {
          await scheduleModeDaysService.createScheduleModeDays({
            day: days[i].day,
            scheduleModeId: lockModeId,
            status: true,
          });
        }
      }
    }

    const updatedMode = scheduleModeService.updateScheduleMode(
      lockModeId,
      req.body
    );

    const response = new Response(
      true,
      200,
      "Schedule Mode updated successfully",
      updatedMode
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

exports.deleteScheduleMode = async (req, res) => {
  try {
    const { lockModeId } = req.body;

    const modeApps = await scheduleModeAppsService.findApps(lockModeId);
    const modeDays = await scheduleModeDaysService.findDays(lockModeId);

    modeApps.map(async (item) => {
      await scheduleModeAppsService.deleteApp(lockModeId, item.packageName);
    });

    modeDays.map(async (item) => {
      await scheduleModeDaysService.deleteDay(lockModeId, item.day);
    });

    const lock = await scheduleModeService.deleteMode(lockModeId);

    const response = new Response(
      true,
      201,
      "Schedule Mode deleted successfully",
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
