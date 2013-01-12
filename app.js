(function() {

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , redis = require('redis')
  , mongo = require('mongodb')
  , sockio = require('socket.io')
  , vizsock = require('./sockets/visualization');

var app = module.exports = express.createServer();
var db = redis.createClient();
var io = sockio.listen(app);

var mongo_server = new mongo.Server("localhost", 27017);
var mongo_connector =  new mongo.Db('crunchbase_database', mongo_server);

mongo_connector.open( function(err, db) {

  db.collectionNames(function(err, collections){
    console.log(collections);
  });

});

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

   // Joining based on the serial
    socket.join(data.room);

    // Handle error handling
    socket.emit('recConn', { 
      status: 1,
      room: data.room 
    });

  });
 
  socket.join('d3_visualization');

  socket.on('transformationUpdate', function(data) {
    io.sockets.in(data.room).emit('transformationResponse', data.selLocs);
  });

});

}());
