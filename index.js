var port = {name: "/dev/ttyACM0", rate: 9600};
var SerialPort = require("serialport");
var serialport = new SerialPort(port.name, {
  baudRate: port.rate,
  parser: SerialPort.parsers.readline('\n')
});

serialport.on('open', function(){
  console.log('Serial Port Opend');
  serialport.on('data', function(data){
      console.log(data);
  });
});
