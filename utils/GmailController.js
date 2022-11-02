import nodeMailer from "nodemailer";

export const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {

        user:"denis7@mail.ru",
        pass:"12345"

    }
});



