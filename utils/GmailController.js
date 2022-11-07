import nodeMailer from "nodemailer";
import {GMAIL_PASS, GMAIL_USER} from "./config.js";


export const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
    }
});



