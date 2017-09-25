var rest = require('rest-js');
var express = require('express');
var EventEmitter = require('events').EventEmitter;
var bodyParser     =  require("body-parser");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var temp =" "
var temperature = " "
var hh = " "
var humidity = " "
var vent = " "
var vv = " "
var restApi = rest('http://192.168.43.226/', {
crossDomain: true
});

 setInterval(function(){
restApi.read('users/der-On/repos', function(error, data) {

 temperature = data.variables.temperature ;
 hh = data.variables.humidity ;
 vv = data.variables.vent ;
 vent = vv ;
 humidity = hh ;
temp = temperature;
temperature = "";
console.log("data");
io.emit('temperature',temp);
io.emit('humidite',humidity);
io.emit('wind',vent);
console.log(vent);
console.log(temp);
console.log(hh) ;

;});},3000);

app.use(express.static(__dirname + '/public'));

// node-aREST
var rest = require("arest")(app);
rest.addDevice('http','192.168.43.226');

// Interface routes
app.get('/', function(req, res){
  var devices = rest.getDevices();
  res.render('index.ejs', {devices: devices});
});

app.use(express.static('public'));

app.get('/', function (req, res) {

    console.log(temp);
    res.render('index.ejs',{temperature: temp, humidity:humidity ,wind: vent })

});

server.listen(3000)
