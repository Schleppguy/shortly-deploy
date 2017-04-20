var app = require('./server-config.js');

var port = process.env.PORT || 4568;
var ip = process.env.IP || 'localhost';

app.listen(port, ip);

console.log('Server now listening on port ' + port);
