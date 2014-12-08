var nodemailer = require("nodemailer");

var async = require("async");

var poslajutracking = require("../lib/poslajutracking_lib.js");

// Add uncaught-exception handler in prod-like environments
if (geddy.config.environment != "development") {
	process.addListener("uncaughtException", function (err) {
		var msg = err.message;
		if (err.stack) {
			msg += "\n" + err.stack;
		}
		if (!msg) {
			msg = JSON.stringify(err);
		}
		geddy.log.error(msg);
	});
}

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
	//service: "Gmail",
	host: "",
	// hostname
	port: 587,
	// port for secure SMTP
	auth: {
		user: "",
		pass: ""
	}
});

var capitaliseFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

