var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    username: { 
      type: String, 
      required: true, 
      index: { 
        unique: true 
      } 
    },
    password: { 
      type: String, 
      required: true 
    }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, null, function(err, hash) {
    if (err) return next(err);
      user.password = hash;
      next();
  });
});

UserSchema.methods.comparePassword = function(supplied, cb) {
    bcrypt.compare(supplied, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);