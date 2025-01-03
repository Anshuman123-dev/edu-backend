// const mongoose = require("mongoose");
// const mailSender = require("../utils/mailSender");
// const emailTemplate = require("../mail/templates/emailVerificationTemplate");
// const OTPSchema = new mongoose.Schema({
// 	email: {
// 		type: String,
// 		required: true,
// 	},
// 	otp: {
// 		type: String,
// 		required: true,
// 	},
// 	createdAt: {
// 		type: Date,
// 		default: Date.now,
// 		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
// 	},
// });

// // Define a function to send emails
// async function sendVerificationEmail(email, otp) {
// 	// Create a transporter to send emails

// 	// Define the email options

// 	// Send the email
// 	try {
// 		const mailResponse = await mailSender(
// 			email,
// 			"Verification Email",
// 			emailTemplate(otp)
// 		);
// 		console.log("Email sent successfully: ", mailResponse.response);
// 	} catch (error) {
// 		console.log("Error occurred while sending email: ", error);
// 		throw error;
// 	}
// }

// // Define a post-save hook to send email after the document has been saved
// OTPSchema.pre("save", async function (next) {
// 	console.log("New document saved to database");

// 	// Only send an email when a new document is created
// 	if (this.isNew) {
// 		await sendVerificationEmail(this.email, this.otp);
// 	}
// 	next();
// });

// const OTP = mongoose.model("OTP", OTPSchema);

// module.exports = OTP;



const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

// Define the OTP schema
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will automatically be deleted after 5 minutes
	},
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
	try {
		// Send the email using the mailSender utility
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.error("Error occurred while sending email: ", error);
		throw error; // Re-throw the error to handle it where needed
	}
}

// Pre-save hook to send email after saving the document
OTPSchema.pre("save", async function (next) {
	// Only send an email when a new document is created
	if (this.isNew) {
		try {
			await sendVerificationEmail(this.email, this.otp);
		} catch (error) {
			console.error("Failed to send verification email: ", error);
			// Optionally handle the error further or pass it to `next(error)` if saving should fail
		}
	}
	next(); // Proceed with saving the document
});

// Create the OTP model
const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
