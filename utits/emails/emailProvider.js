const nodemailer = require("nodemailer");
const Email = require("email-templates");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(
	smtpTransport({
		service: "gmail",
		auth: {
			user: "nhanhkut3@gmail.com",
			pass: "Trungkha1991",
		},
		secure: false, // upgrades later with STARTTLS -- change this based on the PORT
	})
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

	email
		.send({
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
				passwordResetUrl: `http://10.86.98.142:3001/reset-password?resetToken=${passwordResetObject.token}&email=${passwordResetObject.email}`,
			},
		})
		.catch((error) => {
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

	email
		.send({
			template: "passwordChange",
			message: {
				to: user.to,
			},
			locals: {
				productName: "OKR Bussiness",
				name: user.subject,
			},
		})
		.catch(() => {
			console.log("error sending change password email");
			console.log(error);
		});
};
