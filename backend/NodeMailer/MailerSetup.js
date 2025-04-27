const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false,
    auth: {
        user: "",
        pass: ""
    }
});

module.exports = {
    transporter
};
