// TODO: Ignore files starting with .
// Add arduino ports and checked wiht LEDs

//Function of this program: 
//When a new file is added to folder, add that to the queue
//The first item from the queue, when available, starts processing
//When the processing of the first item starts, check if it has the word finished/processed in the file name. If not, start processing this file
//The audio processing function figures out peaks of each 0.5s in the audio file, and then maps those peaks to the lighting PAR
//A timed function starts that runs for 45minutes
//Every 7.5mins, function changes the light to the next thing. After 45minutes remove this current item from queue 
//Save the sound file that is being recorded from microphone on the computer with the same name as input file but record
//renanme the file to have prevFile + "finished"
//and move the next audio file in the queue


const chokidar = require('chokidar');
var fs = require('fs');

//start a list of current files
let visitorAudioList = [];
let finishedFileStatus = "_finished";
let perVisitorHydroAudioDuration = 6; //minutes
let numberOfSamplePerRecording = 6; //sampled 6 times from user recorded audio of 3s to calculate averages of 0s-0.5s, 0.5s-1s, 1s-1.5s, 1.5s-2s, 2s-2.5s, 2.5s-3s
let lightChangeInterval = (perVisitorHydroAudioDuration / numberOfSamplePerRecording) * 60 * 1000; //change light per 7.5 minutes (*1000 for microsecond)
console.log("Light change internval is: " + lightChangeInterval + "ms\n");
let intervalTimer = null;
let isAudioProcessingStarted = false;
let currentLightPlan = []; //list of current light intensities to be passed to arduino


//Arduino things and serial port initialization:
// var SerialPort = require('serialport'); // include the serialport library
// var portName = process.argv[2]; // get the port name from the command line
// var myPort = new SerialPort(portName, 9600);// open the port
// myPort.on('open', openPort); // called when the serial port opens


// One-liner for current directory
chokidar.watch('./visitorrecording').on('all', (event, path) => {
  if (event == "add") {
    // console.log(event, path);
    if (!path.includes(finishedFileStatus)) {
      visitorAudioList.push(path);
      console.log("Adding " + path + " file to aquarium processing queue\n");
      if (isAudioProcessingStarted == false) {
        console.log("Starting aquarium with the first reocrding: " + path);
        startAquariumRecordingTimer(path);

      }

    }
  }
});

function startAquariumRecordingTimer(sourceAudioFile) {
  //start light timer after item has been found in queue
  isAudioProcessingStarted = true;
  decodeSoundFile(sourceAudioFile).then((result) => {
    setAquariumLight(); //set the light for the first time and then interval takes over
    intervalTimer = setInterval(setAquariumLight, lightChangeInterval);
    // setCurrentLightPlan(sourceAudioFile);    
  });
}

function setAquariumLight() {
  var currentLightIntensity = currentLightPlan[0];
  console.log("Setting light intensity to: " + currentLightIntensity + "\n");
  //set the light through arduino
  // sendData('A');
  //remove the item from the array

  //get first item from current light plan
  // myPort.write(currentLightPlan[0]);
  currentLightPlan.shift(); //remove the first item from the light plan because it has been sent

  //if there's nothing left in lightPlan, stop timer
  if (currentLightPlan === undefined || currentLightPlan.length == 0) {
    console.log("Finsihed processing audio file: " + visitorAudioList[0] + ". Removing from queue.");
    renameProcessedFile(visitorAudioList[0]);

    stopAquariumRecordingTimer();

    visitorAudioList.shift();
    if (visitorAudioList.length != 0) {
      console.log("Using the new file to set the light plan" + visitorAudioList[0]);
      // setCurrentLightPlan(visitorAudioList[0]); //
      startAquariumRecordingTimer(visitorAudioList[0]); //start with the next file in queue
    } else {
      console.log("Finished processing all visitor audio files")
    }
  }
}

//go over the recording and populate the array with the peaks
function setCurrentLightPlan(filename) {
  console.log("Set current light plan (filename):" + filename);
  currentLightPlan.toString();

  // currentLightPlan.push('a');
  // currentLightPlan.push('b');
  // currentLightPlan.push('c');
  // currentLightPlan.push('d');
  // currentLightPlan.push('e');
}

function resetCurrentLightPlan() {
  currentLightPlan.length = 0;
}


function stopAquariumRecordingTimer() {
  clearInterval(intervalTimer);
  isAudioProcessingStarted = false;
  resetCurrentLightPlan();
  //check if there is something in the queue and process that
  // if( visitorAudioList[0])
}

function renameProcessedFile(filepath) {
  fs.rename(filepath, filepath + "_finished.wav", function(err) {
    if (err) console.log('ERROR in renaming file: ' + err);
  });
}



// function openPort() {
//   // var brightness = 0; // the brightness to send for the LED
//   console.log('port open');
//   console.log('baud rate: ' + myPort.options.baudRate);

//   // since you only send data when the port is open, this function
//   // is local to the openPort() function:
//   function sendData(aqLightCode) {
//     // convert the value to an ASCII string before sending it:
//     myPort.write(aqLightCode.toString());
//     console.log('Sending ' + aquarium light code + ' out the serial port');
//     // increment brightness by 10 points. Rollover if < 255:
//   }
// }


//start audio processing of the current file
var AudioContext = require('web-audio-api').AudioContext
context = new AudioContext
var fs = require('fs')
var exec = require('child_process').exec;
var _ = require('underscore');

var pcmdata = [];
var peaks = [];


/**
 * [decodeSoundFile Use web-audio-api to convert audio file to a buffer of pcm data]
 * @return {[type]} [description]
 */
function decodeSoundFile(soundfile) {

  return new Promise(function(resolve, reject) {

    console.log("decoding wav file ", soundfile, " ..... ")
    fs.readFile(soundfile, function(err, buf) {
      if (err) throw err
      context.decodeAudioData(buf, function(audioBuffer) {
        console.log(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate, audioBuffer.duration);
        pcmdata = (audioBuffer.getChannelData(0));
        samplerate = audioBuffer.sampleRate;
        maxvals = [];
        max = 0;
        peaks = [];
        // playsound(soundfile);

        findPeaks(pcmdata, samplerate).then(() => {
          if (currentLightPlan.length != 0) {
            resolve("light plan populated");
          } else {
            reject(new Error("broke promie. unable to populate"));
          }
        })



      }, function(err) {
        throw err
      })
    })

  });

}



// let findPeaks = new Promise(function (resolve, reject) { 

// });


/**
 * [findPeaks Naive algo to identify peaks in the audio data, and wave]
 * @param  {[type]} pcmdata    [description]
 * @param  {[type]} samplerate [description]
 * @return {[type]}            [description]
 */
function findPeaks(pcmdata, samplerate) {
  return new Promise(function(resolve, reject) {

    var interval = 0.6 * 1000;
    index = 0;
    var step = Math.round(samplerate * (interval / 1000));
    var max = 0;
    var prevmax = 0;
    var prevdiffthreshold = 0.3;

    //loop through song in time with sample rate
    var samplesound = setInterval(function() {
      if (index >= pcmdata.length) {
        clearInterval(samplesound);
        console.log("finished sampling sound");
        resolve();
      }

      for (var i = index; i < index + step; i++) {
        max = pcmdata[i] > max ? pcmdata[i].toFixed(1) : max;
      }

      // Spot a significant increase? Potential peak
      bars = getbars(max);
      if (max - prevmax >= prevdiffthreshold) {
        bars = bars + " == peak == "
      }

      // Print out mini equalizer on commandline
      console.log(bars, max);
      // peaks.push(max);
      currentLightPlan.push(peakToLightMap(max))

      prevmax = max;
      max = 0;
      index += step;
    }, interval, pcmdata);

    //go through the peaks and high max and lowest in array
    //check the difference between highest and lowest
    //if the difference is large, leave as is and map
    //if the difference is too small, the audio probably needs amplification (multiply by 0.5)
  });
}


function peakToLightMap(pcmamp) {
  var resultintesity;
  if (pcmamp < 0.2) {
    resultintesity = 'a';
  } else if (pcmamp >= 0.2 && pcmamp < 0.4) {
    resultintesity = 'b';
  } else if (pcmamp >= 0.4 && pcmamp < 0.6) {
    resultintesity = 'c';
  } else if (pcmamp >= 0.6 && pcmamp < 0.8) {
    resultintesity = 'd';
  } else if (pcmamp >= 0.8) {
    resultintesity = 'e';
  }
  return resultintesity;
}

/**
 * TBD
 * @return {[type]} [description]
 */
function detectBeats() {

}

/**
 * [getbars Visualize image sound using bars, from average pcmdata within a sample interval]
 * @param  {[Number]} val [the pcmdata point to be visualized ]
 * @return {[string]}     [a set of bars as string]
 */
function getbars(val) {
  bars = ""
  for (var i = 0; i < val * 50 + 2; i++) {
    bars = bars + "|";
  }
  return bars;
}

/**
 * [Plays a sound file]
 * @param  {[string]} soundfile [file to be played]
 * @return {[type]}           [void]
 */
function playsound(soundfile) {
  // linux or raspi
  // var create_audio = exec('aplay'+soundfile, {maxBuffer: 1024 * 500}, function (error, stdout, stderr) {
  var create_audio = exec('ffplay -autoexit ' + soundfile, {
    maxBuffer: 1024 * 500
  }, function(error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      //console.log(" finshed ");
      //micInstance.resume();
    }
  });
}


//start a timer for the lighting things
//count every 7.5 minutes and use current light intensitiies light to pass it arduino