var express = require('express')
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();
var temperature = "";
var Temp="";
btSerial.on('found', function(address, name) {
	if (name=='HC-06')
	btSerial.findSerialPortChannel(address, function(channel) {
		btSerial.connect(address, channel, function() {
			console.log('connected');


			btSerial.write(new Buffer('my data', 'utf-8'), function(err, bytesWritten) {
				if (err) console.log(err);
			});

			btSerial.on('data', function(buffer) {
				temperature = temperature + buffer.toString('utf-8')

				if (temperature.indexOf("\n") != -1){

				console.log("La temperature est de "+temperature);
				Temp = temperature;
				temperature = "";
				io.emit('temperature',Temp);
				

					}
			});
		}, function () {
			console.log('cannot connect');
		});

		// close the connection when you're ready
		btSerial.close();
	}, function() {
		console.log('found nothing');
	});
});

btSerial.inquireSync();



app.use(express.static('public'));

app.get('/', function (req, res) {

  res.render('index.ejs',{temperature: Temp})

})
server.listen(3000)
