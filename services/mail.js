const EmailNotifications = require("../helpers/EmailNotifications");

module.exports = class EmailService {
  async sendSignupEmail(email, link, name) {
    return EmailNotifications.signupEmail(email, link, name);
  }

  async sendPasswordResetMail(firstName, email, link) {
    return EmailNotifications.sendPasswordResetMail(firstName, email, link);
  }

  async sendAccountabilityPartnerMail(firstName, email, code) {
    return EmailNotifications.sendAccountabilityPartnerMail(
      firstName,
      email,
      code
    );
  }
};
