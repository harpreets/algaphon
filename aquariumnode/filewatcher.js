
const chokidar = require('chokidar');

//start a list of current files
let visitorAudioList = [];
let finishedFileStatus = "_finished";


// // One-liner for current directory
// chokidar.watch('/sounds').on('all', (event, path) => {
//   if (event == "add"){
//     console.log(event, path);
//     if (!path.includes(finishedFileStatus)){
//       visitorAudioList.push(path);
//       console.log("first in list:" + visitorAudioList[0]);
//     }  
//   }
// });


// One-liner for current directory
chokidar.watch('./sounds').on('all', (event, path) => {
  console.log(event, path);
});




// var SerialPort = require('serialport'); // include the serialport library
// var portName = process.argv[2]; // get the port name from the command line
// var myPort = new SerialPort(portName, 9600);// open the port
// myPort.on('open', openPort); // called when the serial port opens
