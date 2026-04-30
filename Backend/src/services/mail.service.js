import nodemailer from "nodemailer";

const hasMailConfig = Boolean(
    process.env.GOOGLE_USER &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_CLIENT_ID
);

const transporter = hasMailConfig ? nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
}) : null;

if (!transporter) {
    console.warn("Email transporter is disabled. Missing Google mail environment variables.");
}


export async function sendEmail({ to, subject, html, text }) {
    if (!transporter) {
        throw new Error("Email service is not configured");
    }

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details);
}
