var nodemailer = require("nodemailer");

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
    host: "mail.alif.my", // hostname
    port: 587, // port for secure SMTP
    auth: {
        user: "noreply@alif.my",
        pass: "athirah89"
    }
});


// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Pos Laju Tracking Service <noreply@alif.my>", // sender address
    //to: "bar@blurdybloop.com, baz@blurdybloop.com", // list of receivers
    to: "alifaziz@gmail.com",
    subject: "Parcel status", // Subject line
    text: "Delivered", // plaintext body
    html: "<b>Delivered</b>" // html body
}


//Cron job to fetch parcel delivery status
var cronJob = require("cron").CronJob;

var job = new cronJob("*/5 * * * *", function() {
    //geddy.log.debug("ALIF IS GREAT");

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            geddy.log.error("Error plak: " + error);
        } else {
            geddy.log.info("Message sent: " + response.message);
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });

}, function() {}, true, "Asia/Kuala_Lumpur");