var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(3000);

app.get('/',function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.use('/', express.static(__dirname + '/'));

io.sockets.on('connection',function(socket){
	var sp = new SerialPort('com3',{
		baudrate: 9600,
		parser: serialport.parsers.readline("\n")
	});

	sp.on('open',onOpen);
	sp.on('data',onData);
	sp.on('close',cerrar);
});

function onOpen(){
	console.log('Se ha conectado al puerto serial');
}

function onData(data){
	console.log(data);
	io.sockets.emit('newData',data);
}

function cerrar(){
	console.log('Se termino la conexion con el puerto serial');
}
