const port = {name: "/dev/ttyACM0", rate: 9600};
const SerialPort = require("serialport");
const jsonfile = require('jsonfile');
const moment = require('moment');
const fs = require('fs');

let name = "./data/delete_me_im_lazy.json";//hardcoded for testing purposes, leave empty otherwise

var serialport = new SerialPort(port.name, {
  baudRate: port.rate,
  parser: SerialPort.parsers.readline('\n')
});
serialport.on('open', function(){
  console.log('Serial Port Opened');
  serialport.on('data', function(data){
    if (data.length > 140) {
      writeJsonFile(data);
      terminalOutput(data);
    }
    // console.log(data);
  });
});

function writeJsonFile(string){
  let filename = './data/'+moment().format("DD_MM_YYYY")+'.json';
  fs.access(filename, fs.F_OK, function(err) {
    if (!err) {
      fs.appendFile(filename, moment().format('"HH.mm":')+string+",", function (err){
        if (err) {
          console.log(err);
        }
      }); //fs appendFile
    } else { //if no file was found
      fs.writeFile(filename, '"data":{['+moment().format('"HH.mm":')+string+",", function(err){
        if (err) {
          console.log(err);
        }
      });//writeFile
      fs.appendFile(name, '"99.99":{"status": "end of the day"}]};', function(err){
        if (err) {
          console.log(err);
        }else{
          name = filename;
        }
      });//appendFile
    }
  });//access
}

function terminalOutput(string) {
  let data = JSON.parse(string);
  //{rainD:1, rainA:1023, status: "working", humidity: 36.00,
  // tempOne: 23.00, altProv:236, tempTwo: 23.79, pressureAbs: 976.90,
  // pressureRel: 1004.69, altComp: 236}
  function rain(rainD, rainA){
    if(!rainD){
      return rainA;
    }else{
      return "nope!";
    }
  };
  //Boolean(data.rainD)
  console.log("|==================\t***\t==================|");
  console.log("| Outdoors t.:\t"+data.tempOne+" C \t | Indoors t.: \t"+data.tempTwo+" C\t  |");
  console.log("| Pressure: \t"+data.pressureRel+"\t | Humidity: \t"+data.humidity+"% \t  |");
  console.log("| Altitude: \t"+data.altComp+" m.\t | Raining: \t"+rain(data.rainD, data.rainA)+"\t  |" );
  console.log("|=="+moment().format("= DD.MM.YYYY ===\t***\t==== HH:mm:ss =")+"===|");
  console.log("|__________________\t___\t__________________|");
}
