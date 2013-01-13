(function() {

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , sockio = require('socket.io');

var app = module.exports = express.createServer();
var io = sockio.listen(app);

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.listen(3000);

io.sockets.on('connection', function (socket) {
 
  socket.on('subscribe', function(data) {

    socket.join(data.room);
    socket.emit('recConn', { 
      status: 1,
      room: data.room 
    });

  });
 
  socket.on('transformationUpdate', function(data) {
    io.sockets.in(data.room).emit('transformationResponse', data.selLocs);
  });

});

}());
