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
// var smtpTransport = nodemailer.createTransport("SMTP", {
// 	//service: "Gmail",
// 	host: "",
// 	// hostname
// 	port: 587,
// 	// port for secure SMTP
// 	auth: {
// 		user: "",
// 		pass: ""
// 	}
// });

var capitaliseFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Cron job to fetch parcel delivery status
// var cronJob = require("cron").CronJob;

// // 0 7-18 * * *
// var job = new cronJob("*/30 * * * *", function () {
// 	//geddy.log.debug("ALIF IS GREAT");
// 	geddy.model.Parcel.all({
// 		delivered: 0
// 	}, function (err, data) {
// 		var parceldata = data;
// 		if (err) {
// 			throw err;
// 		}
// 		// this is going to be costly. So... refactoring mgkin diperlukan later.
// 		if (parceldata.length > 0) {
// 			async.map(parceldata, function (parcelObj, callback) {
// 				poslajutracking.parseTrackingID(parcelObj.posid, null, null, function (respObj) {
// 					// if the parcel has any data..
// 					if (respObj.data.length > 0) {
// 						if (parcelObj.status !== respObj.data[0].process) {
// 							// if the parcel successfullt delivered, set the delivered flag to 1.
// 							if (respObj.data[0].process.search("successfully delivered") != -1) {
// 								parcelObj.updateProperties({
// 									delivered: 1
// 								});
// 							}
// 							// save the current status
// 							parcelObj.updateProperties({
// 								status: respObj.data[0].process
// 							});
// 							//console.log(parcelObj.posid);
// 							parcelObj.save();
// 							// setup e-mail data with unicode symbols
// 							var mailOptions = {
// 								from: "Pos Laju Tracking Service <noreply@alif.my>",
// 								bcc: parcelObj.ccnotifyemail,
// 								replyTo: parcelObj.ccnotifyemail,
// 								// sender address
// 								//to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
// 								to: parcelObj.notifyemail,
// 								subject: "Parcel Delivery Status - " + parcelObj.posid + " - " + capitaliseFirstLetter(parcelObj.postitle),
// 								// Subject line
// 								// plaintext body
// 								html: "Process: " + respObj.data[0].process + "<br />" + "Office: " + respObj.data[0].office + "<br />" + "Date: " + respObj.data[0].date + "<br />" + "Time: " + respObj.data[0].time
// 							};
// 							// send mail with defined transport object
// 							smtpTransport.sendMail(mailOptions, function (error, response) {
// 								if (error) {
// 									geddy.log.error("Error: " + error);
// 								} else {}
// 							});
// 						}
// 					}
// 				});
// 			}, function (err, stats) {
// 				if (err) {} else {}
// 			});
// 		}
// 	});
// }, function () {}, true, "Asia/Kuala_Lumpur");
