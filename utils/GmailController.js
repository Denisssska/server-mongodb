import nodeMailer from "nodemailer";
const USER = "blogpostmern@gmail.com";
//Tony123man
const PASS = 'zziwdmwmcqsthakh'

export const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user:USER,
        pass:PASS
    }
});



