var nodemailer = require("nodemailer");

var poslajutracking = require("../lib/poslajutracking_lib.js");

// Add uncaught-exception handler in prod-like environments
if (geddy.config.environment != "development") {
    process.addListener("uncaughtException", function(err) {
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
    host: "mail.alif.my",
    // hostname
    port: 587,
    // port for secure SMTP
    auth: {
        user: "noreply@alif.my",
        pass: "athirah89"
    }
});

//Cron job to fetch parcel delivery status
var cronJob = require("cron").CronJob;

var job = new cronJob("*/1 * * * *", function() {
    //geddy.log.debug("ALIF IS GREAT");
    geddy.model.Parcel.all({
        delivered: 0
    }, function(err, data) {
        var parceldata = data;
        if (err) {
            throw err;
        }
        // this is going to costly. So... refactoring mgkin diperlukan later.
        if (parceldata.length > 0) {
            for (var i = parceldata.length - 1; i >= 0; i--) {
                var f = i;
                poslajutracking.parseTrackingID(parceldata[f].posid, null, null, function(respObj) {
                    if (respObj.data[data.length - 1].process.search("successfully delivered") != -1) {
                        parceldata[f].updateProperties({
                            delivered: 1
                        });
                        parceldata[f].save();
                    }
                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: "Pos Laju Tracking Service <noreply@alif.my>",
                        // sender address
                        //to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
                        to: parceldata[f].notifyemail,
                        subject: "Parcel Status",
                        // Subject line
                        text: respObj.data[data.length - 1].process,
                        // plaintext body
                        html: "<b>" + respObj.data[data.length - 1].process + "</b>"
                    };
                    // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, function(error, response) {
                        if (error) {
                            geddy.log.error("Error: " + error);
                        } else {
                            geddy.log.info("Message sent: " + response.message);
                        }
                    });
                });
            }
        }
    });
}, function() {}, true, "Asia/Kuala_Lumpur");