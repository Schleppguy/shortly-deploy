var app = require('./server-config.js');

var port = process.env.PORT || 3000;
var ip = process.env.IP;

app.listen(port);

console.log('Server now listening on port ' + port);
