import config from '../config';
import NodeMailer from 'nodemailer';
import { log } from '../helper/sentry';
const env = process.env.NODE_ENV || 'development';
const login = process.env.EMAIL_LOGIN;
const pass = process.env.EMAIL_PASS;

const transporter = NodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: login,
    pass: pass,
  },
});

function send(to, subject, text) {
  const mailOptions = {
    from: login,
    to: to,
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      log(error);
    } else {
      // console.log('Email sent: ' + info.response);
    }
  });
}

export { send };
