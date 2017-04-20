var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var LinkSchema = new Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: Number
});

LinkSchema.pre('save', function (next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});


module.exports = mongoose.model('Link', LinkSchema);

