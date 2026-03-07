import nodemailer from "nodemailer";

type MailInput = {
  to: string;
  subject: string;
  html: string;
};

function createTransport() {
  const host = process.env.BREVO_HOST || "smtp-relay.brevo.com";
  const port = Number(process.env.BREVO_PORT || "587");
  const user = process.env.BREVO_USER;
  const pass = process.env.BREVO_PASS;

  if (!user || !pass) {
    throw new Error("Missing Brevo SMTP credentials.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function buildEmailShell(title: string, body: string) {
  return `
    <div style="margin:0;padding:32px 16px;background:#eef1f7;font-family:Arial,sans-serif;color:#1f2940">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 18px 50px rgba(31,41,64,0.12)">
        <div style="padding:18px 28px;background:linear-gradient(135deg,#1f2940 0%,#4f46e5 100%);color:#f8f8ff">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;opacity:0.88">QuickHire</div>
          <h1 style="margin:14px 0 0;font-size:28px;line-height:1.1">${title}</h1>
        </div>
        <div style="padding:30px 28px 24px;line-height:1.75;font-size:15px;color:#425268">
          ${body}
        </div>
      </div>
    </div>
  `;
}

export async function sendMail({ to, subject, html }: MailInput) {
  const sender = process.env.EMAIL_SENDER_EMAIL || "no-reply@quickhire.app";
  const transport = createTransport();

  await transport.sendMail({
    from: `QuickHire <${sender}>`,
    to,
    subject,
    html,
  });
}

export async function sendEmailVerificationOtpEmail(email: string, name: string, otp: string) {
  const html = buildEmailShell(
    "Verify your email",
    `
      <p style="margin:0 0 16px">Hi ${name || "there"},</p>
      <p style="margin:0 0 16px">
        Welcome to QuickHire. Use the 6-digit verification code below to confirm your email address and activate your account.
      </p>
      <div style="margin:28px 0;padding:18px 20px;border-radius:22px;background:#f4f7fb;border:1px solid #dbe4ec;text-align:center">
        <div style="font-size:12px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#7f5c31;margin-bottom:10px">Verification code</div>
        <div style="font-size:34px;line-height:1;font-weight:800;letter-spacing:0.28em;color:#1f2940">${otp}</div>
      </div>
      <p style="margin:0 0 12px">This code will expire in 2 minutes.</p>
      <p style="margin:0">If you did not request this, you can ignore this email.</p>
    `,
  );

  await sendMail({
    to: email,
    subject: "Verify your QuickHire account",
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string, dashboardUrl: string) {
  const html = buildEmailShell(
    "Welcome to QuickHire",
    `
      <p style="margin:0 0 16px">Hi ${name || "there"},</p>
      <p style="margin:0 0 16px">
        Your account is ready. You can now manage job postings, company assets, and incoming applications.
      </p>
      <div style="margin:26px 0">
        <a href="${dashboardUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:700">Open QuickHire admin</a>
      </div>
    `,
  );

  await sendMail({
    to: email,
    subject: "Welcome to QuickHire",
    html,
  });
}
