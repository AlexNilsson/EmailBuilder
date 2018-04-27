var connect = require('connect');
var serveStatic = require('serve-static');

var port = process.env.PORT || process.argv[2] || 8000;
var project = process.env.NODE_ENV == 'production' ? require('./config.json').buildFolder : './app';

connect().use(serveStatic(project)).listen(port, function() {
    console.log('Server running on %s...', port);
});