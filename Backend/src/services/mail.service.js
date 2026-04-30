import nodemailer from "nodemailer";

const hasMailConfig = Boolean(
    process.env.GOOGLE_USER &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_CLIENT_ID
);

let transporter = null;

if (hasMailConfig) {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // use TLS
        auth: {
            type: 'OAuth2',
            user: process.env.GOOGLE_USER,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            clientId: process.env.GOOGLE_CLIENT_ID
        }
    });

    // Verify connection on startup
    transporter.verify((error, success) => {
        if (error) {
            console.error("❌ Email transporter verification failed:", error.message);
        } else {
            console.log("✅ Email transporter is ready");
        }
    });
} else {
    console.warn("⚠️ Email transporter is disabled. Missing Google mail environment variables.");
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

    try {
        const details = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", to);
        return details;
    } catch (error) {
        console.error("❌ Failed to send email:", error.message);
        console.error("Error code:", error.code);
        throw error;
    }
}
