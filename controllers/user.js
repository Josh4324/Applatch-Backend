const UserService = require("../services/user");
const SocialService = require("../services/social");
const AddictiveService = require("../services/addictive");
const MailService = require("../services/mail");
const argon2 = require("argon2");
const { Response, Token } = require("../helpers");
const { v4: uuidv4 } = require("uuid");
const front = "https://applatch.com/";
const random = require("random");

const userService = new UserService();
const socialService = new SocialService();
const addictiveService = new AddictiveService();
const mailService = new MailService();
const token = new Token();

exports.signUp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.findUserWithEmail(email);
    if (user) {
      const response = new Response(true, 409, "This user already exists");
      return res.status(response.code).json(response);
    }

    const code = uuidv4().slice(0, 6);

    const payload = {
      code,
    };

    const newToken = await token.generateToken(payload);
    const password = await argon2.hash(req.body.password);

    req.body.password = password;
    req.body.role = "user";
    req.body.verify = false;
    req.body.token = newToken;
    req.body.onboardStage = "1";

    const newUser = await userService.createUser(req.body);

    const verificationLink = `https://${req.headers.host}/api/v1/user/verify/${newUser.id}/${newToken}`;

    // send verification mail
    const mail = await mailService.sendSignupEmail(
      newUser.email,
      verificationLink,
      newUser.firstName
    );

    const payload1 = {
      id: newUser.id,
      role: newUser.role,
    };

    const Token = await token.generateToken(payload1);

    const userData = await userService.findUserWithId(newUser.id);

    const data = {
      token: Token,
      userData,
    };

    const response = new Response(true, 201, "User created successfully", data);
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

exports.verifyEmail = async (req, res) => {
  try {
    const { id, token } = req.params;

    const user = await userService.findUserWithId(id);

    if (!user) {
      const response = new Response(true, 409, "This user does not exists");
      return res.status(response.code).json(response);
    }

    if (user.token !== token) {
      const response = new Response(true, 409, "Invalid token");
      return res.status(response.code).json(response);
    }

    const updatePayload = {
      verify: true,
    };

    await userService.updateUser(id, updatePayload);

    const response = new Response(true, 200, "User Verified Successfully");
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

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserWithEmail(email);

    if (!user) {
      const response = new Response(false, 401, "Incorrect email or password");
      return res.status(response.code).json(response);
    }

    if (user.password === null) {
      const response = new Response(false, 401, "Wrong login method");
      return res.status(response.code).json(response);
    }

    const userPassword = user.password;
    const checkPassword = await argon2.verify(userPassword, password);

    if (!user || !checkPassword) {
      const response = new Response(false, 401, "Incorrect email or password");
      return res.status(response.code).json(response);
    }

    if (user.verify === false) {
      const code = uuidv4().slice(0, 6);

      const payload = {
        code,
      };

      const newToken = await token.generateToken(payload);

      const verificationLink = `http://${req.headers.host}/api/v1/user/verify/${user.id}/${newToken}`;

      // send verification mail
      await mailService.sendSignupEmail(
        user.email,
        verificationLink,
        user.firstName
      );
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const newToken = await token.generateToken(payload);

    const userData = await userService.findUserWithId(user.id);

    const data = {
      token: newToken,
      userData,
    };

    const response = new Response(
      true,
      200,
      "User logged in Successfully",
      data
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

exports.resendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userService.findUserWithEmail(email);

    const code = uuidv4().slice(0, 6);

    const payload = {
      code,
    };

    const newToken = await token.generateToken(payload);

    req.body.token = newToken;

    await userService.updateUserWithEmail(email, req.body);

    const verificationLink = `http://${req.headers.host}/api/v1/user/verify/${user.id}/${newToken}`;

    // send verification mail
    await mailService.sendSignupEmail(
      user.email,
      verificationLink,
      user.firstName
    );
    const response = new Response(true, 200, "Email sent Successfully");
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userService.findUserWithEmail(email);

    if (!user) {
      const response = new Response(false, 401, "User does not exist");
      return res.status(response.code).json(response);
    }

    const code = random.int(1000, 9999);

    await userService.updateUserWithEmail(email, { code });

    const mail = await mailService.sendPasswordResetMail(
      user.name,
      email,
      code
    );

    const response = new Response(true, 200, "Email sent to mail");
    return res.status(response.code).json(response);
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

exports.socialSignUp = async (req, res) => {
  try {
    req.body.verify = true;
    req.body.onboardStage = "1";
    const userData = await userService.createUser(req.body);

    const code = uuidv4().slice(0, 6);

    const payload = {
      code,
    };

    const newToken = await token.generateToken(payload);

    const user = await userService.findUserWithId(userData.id);

    const data = {
      token: newToken,
      user,
    };

    const response = new Response(true, 201, "User created successfully", data);
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

exports.socialLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userService.findUserWithEmail(email);

    const payload = {
      id: user.id,
      role: user.role,
    };

    const newToken = await token.generateToken(payload);

    const userData = await userService.findUserWithId(user.id);

    const data = {
      token: newToken,
      userData,
    };
    const response = new Response(
      true,
      200,
      "User logged in Successfully",
      data
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

exports.socialCheck = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userService.findUserWithEmail(email);

    if (user) {
      const response = new Response(true, 200, "This user already exists", {});
      return res.status(response.code).json(response);
    } else {
      const response = new Response(true, 400, "This user does not exists", {
        email,
      });
      return res.status(response.code).json(response);
    }
  } catch (err) {
    const response = new Response(
      false,
      500,
      "An error ocurred, please try again",
      err
    );
    return res.status(response.code).json(response);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.payload;

    const { social } = req.body;

    const user = await userService.updateUser(id, req.body);

    if (social || social?.length > 0) {
      const allapps = await addictiveService.findAddictive(id);
      for (let i = 0; i < social.length; i++) {
        if (
          social[i].status === false &&
          allapps.filter((item) => item.packageName === social[i].packageName)
            .length === 1
        ) {
          await addictiveService.deleteUserAppWithId(id, social[i].packageName);
        }

        if (
          social[i].status === true &&
          allapps.filter((item) => item.packageName === social[i].packageName)
            .length === 0
        ) {
          await addictiveService.createAddictive({
            name: social[i].name,
            userId: id,
            packageName: social[i].packageName,
            icon: social[i].icon,
          });
        }
      }
    }

    const userData = await userService.findUserWithId(id);

    const response = new Response(
      true,
      200,
      "User profile updated successfully",
      userData
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

exports.getProfileData = async (req, res) => {
  try {
    const { id } = req.payload;

    const user = await userService.findUserWithId(id);

    const response = new Response(true, 200, "Success", user);
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

exports.resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const { id } = req.payload;

    const realUser = await userService.findUserAndPasswordWithId(id);

    const userPassword = realUser.password;
    const checkPassword = await argon2.verify(userPassword, oldPassword);

    if (!realUser || !checkPassword) {
      const response = new Response(false, 401, "Incorrect email or password");
      return res.status(response.code).json(response);
    }

    const password = await argon2.hash(newPassword);

    const user = await userService.updateUser(id, { password });

    const response = new Response(true, 200, "Password reset successful");
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

exports.reset = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    const { id } = req.payload;

    if (password !== confirmPassword) {
      const response = new Response(
        false,
        401,
        "Password and confirmPassword to do match"
      );
      return res.status(response.code).json(response);
    }

    const pass = await argon2.hash(password);

    await userService.updateUser(id, { password: pass });

    const response = new Response(true, 200, "Password reset successful");
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

exports.resetWithoutAuth = async (req, res) => {
  try {
    const { password, confirmPassword, code, email } = req.body;

    const user = await userService.findUserWithEmail(email);

    if (user.code !== code) {
      const response = new Response(true, 400, "Invalid code");
      return res.status(response.code).json(response);
    }

    if (password !== confirmPassword) {
      const response = new Response(
        false,
        401,
        "Password and confirmPassword to do match"
      );
      return res.status(response.code).json(response);
    }

    const pass = await argon2.hash(password);

    await userService.updateUserWithEmail(email, { password: pass });

    const response = new Response(true, 200, "Password reset successful");
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

exports.addAccountabilityPartner = async (req, res) => {
  try {
    const { id } = req.payload;

    const { partner_email } = req.body;

    const code = random.int(1000, 9999);

    req.body.code = code;

    const user = await userService.updateUser(id, req.body);

    // send verification mail
    const mail = await mailService.sendAccountabilityPartnerMail(
      user.firstName,
      partner_email,
      code
    );

    const userData = await userService.findUserWithId(id);

    const response = new Response(
      true,
      200,
      "Partner Added successfully",
      userData
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

exports.verifyAccountabilityPartner = async (req, res) => {
  try {
    const { id } = req.payload;

    const { code } = req.body;

    const user = await userService.findUserWithId(id);

    if (user.code !== code) {
      const response = new Response(true, 409, "Invalid code");
      return res.status(response.code).json(response);
    }

    const updatePayload = {
      partner_email_verify: true,
    };

    await userService.updateUser(id, updatePayload);

    const response = new Response(true, 200, "Verification Successful");
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
