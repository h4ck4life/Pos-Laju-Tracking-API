
// Add uncaught-exception handler in prod-like environments
if (geddy.config.environment != 'development') {
  process.addListener('uncaughtException', function (err) {
    var msg = err.message;
    if (err.stack) {
      msg += '\n' + err.stack;
    }
    if (!msg) {
      msg = JSON.stringify(err);
    }
    geddy.log.error(msg);
  });
}

// Cron job to fetch parcel delivery status
// var cronJob = require('cron').CronJob;
// var job = new cronJob('1 1 * * * *', function(){
//     geddy.log.debug("ALIF IS GREAT");
//   }, function () {
//     // This function is executed when the job stops
//   }, 
//   true /* Start the job right now */,
//   "Asia/Kuala_Lumpur" /* Time zone of this job. */
//  
// );

