const nodemailer = require("nodemailer");
const Email = require("email-templates");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(
	smtpTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_ADDRESS,
			pass: process.env.EMAIL_PASSWORD,
		},
		secure: false, // upgrades later with STARTTLS -- change this based on the PORT
	}),
);

// verify connection configuration
transporter.verify((error) => {
	if (error) {
		console.log("error with email connection");
		console.log(error);
	}
});

exports.sendPasswordReset = async (passwordResetObject) => {
	const email = new Email({
		views: { root: __dirname },
		message: {
			from: "nhanhkut3@gmail.com",
		},
		// uncomment below to send emails in development/test env:
		send: true,
		transport: transporter,
	});

	email.send({
		template: "passwordReset",
		message: {
			to: passwordResetObject.email,
		},
		locals: {
			productName: "OKR Bussiness",
			name:
				passwordResetObject.firstname + " " + passwordResetObject.lastname,
			// passwordResetUrl should be a URL to your app that displays a view where they
			// can enter a new password along with passing the resetToken in the params
			passwordResetUrl: `http://10.86.98.142:3001/reset-password?resetToken=${ passwordResetObject.token }&email=${ passwordResetObject.email }`,
		},
	}).catch((error) => {
		console.log("error sending password reset email");
		console.log(error);
	});
};

exports.sendPasswordChangeEmail = async (user) => {
	const email = new Email({
		views: { root: __dirname },
		message: {
			from: "nhanhkut3@gmail.com",
		},
		// uncomment below to send emails in development/test env:
		send: true,
		transport: transporter,
	});

	email.send({
		template: "passwordChange",
		message: {
			to: user.to,
		},
		locals: {
			productName: "OKR Bussiness",
			name: user.subject,
		},
	}).catch((error) => {
		console.log("error sending change password email");
		console.log(error);
	});
};

exports.sendOTP = async (user) => {
	const htmlContent = `
	<div class="card text-center">
			<div class="card-body">
					<div class="card-title">Your acount verification code is <span style="background-color: #0d6efd!important;color: #fff!important;padding: .5rem!important;"><strong> ${ user.otp }</strong></span></div>
			</div>
	</div>
	`;
	let mailOptions = {
		from: `OKR Bussiness <${ process.env.EMAIL_ADDRESS }>`,
		replyTo: process.env.EMAIL_ADDRESS,
		to: user.email,
		subject: "Verify account by OTP code",
		html: htmlContent,
	};

	let info = await transporter.sendMail(mailOptions);

	return info.messageId !== null;
};
