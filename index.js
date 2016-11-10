var port = {name: "/dev/ttyACM3", rate: 9600};
var SerialPort = require("serialport");
var serialport = new SerialPort(port.name, {
  baudRate: port.rate,
  parser: SerialPort.parsers.readline('\n')
});
serialport.on('open', function(){
  console.log('Serial Port Opened');
  serialport.on('data', function(data){
    if (data.length > 140) {
      parseData(data);
    }
    // console.log(data);
  });
});

function parseData(string) {
  let data = JSON.parse(string);
  let date = new Date();
  //{rainD:1, rainA:1023, status: "working", humidity: 36.00,
  // tempOne: 23.00, altProv:236, tempTwo: 23.79, pressureAbs: 976.90,
  // pressureRel: 1004.69, altComp: 236}
  console.log("|=================\t***\t=================|");
  console.log("| Temp. outside: "+data.tempOne+" C \t | Temp. inside: "+data.tempTwo+" C |");
  console.log("| Pressure: "+data.pressureRel+" \t | Humidity: "+data.humidity+"% \t |");
  console.log("| Altitude: "+data.altComp+" \t | Raining:"+data.rainD+"\t\t |" );
  console.log("| \t"+date+"\t |");
}
