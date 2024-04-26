import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_API_KEY, UKR_NET_FROM} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, 
    secure: true,
    auth: {
        user: UKR_NET_FROM,
        pass: UKR_NET_API_KEY,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

/*
const data = {
    to: "cijepiy637@centerf.com",
    subject: "Test email",
    html: "<strong>Test email</strong>"
};
*/

const sendEmail = data => {
    const email = { ...data, from: UKR_NET_FROM };
    return transport.sendMail(email);
}

export default sendEmail;