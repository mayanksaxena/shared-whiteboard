var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, { path: '/socket.io'});
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require("path");
var port =  process.argv[2] || process.env.PORT || 8888;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.render("index");
});

io.of('/external').on('connection', function(socket) {
  socket.on('refresh canvas', function(msg) {
    io.of('/external').emit('refresh canvas', msg);
  });
});

//Local Connection of socket.
io.on('connection', function(socket){
  socket.on('refresh canvas', function(msg) {
    io.emit('refresh canvas', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
