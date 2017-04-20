var mongoose = require('mongoose');
var port = process.env.PORT || 27017;
var ip = process.env.IP || 'localhost';
var dburl = `mongodb://${ip}:${port}/shortly_deploy`;
mongoose.connect(dburl);
var db = mongoose.connection;

function gracefulShutdown(msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
}

db.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    db.kill(db.pid, 'SIGUSR2');
  });
});

db.on('SIGINT', function () {
  gracefulShutdown('App termination (SIGINT)', function () {
    db.exit(0);
  });
});
// For Heroku app termination
db.on('SIGTERM', function () {
  gracefulShutdown('App termination (SIGTERM)', function () {
    db.exit(0);
  });
});

module.exports = db;
