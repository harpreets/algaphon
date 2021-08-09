//GDRIVE API Upload function

// Client ID and API key from the Developer Console
var CLIENT_ID = '909161419224-470smbbtdimk88tagufk88pvfvqref7t.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBvgdJnZ3EUtY9ak4qKZ9pu003Pch-xapk';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be // included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file';

function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

function initClient() {
	gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	}).then(function() {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);



		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		// populateFile();
	}, function(error) {
		appendPre(JSON.stringify(error, null, 2));
	});
}

function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		// listFiles();
	} else {}
}

function uploadAudiofile(audioblobMsg) {

	//e.g: if uploading text file

	// var fileContent = 'sample text'; 
	// var file = new Blob([fileContent], {
	// 	type: 'text/plain'
	// });


	// var parentId = ''; //some parentId of a folder under which to create the new folder
	// var metadata = {
	// 	// 'name' : 'New Folder',
	// 	// 'mimeType' : 'application/vnd.google-apps.folder',
	// 	// don't parents': ['ROOT_FOLDER']

	// 	'name': 'sampleName', // Filename at Google Drive
	// 	'mimeType': 'text/plain', // mimeType at Google Drive
	// };

	// var form = new FormData();
	// form.append('metadata', new Blob([JSON.stringify(metadata)], {
	// 	type: 'application/json'
	// }));
	// form.append('file', file);

	//Uploading audio
	var parentId = ''; //some parentId of a folder under which to create the new folder
	var randomAudioFileName = (Math.random() + 1).toString(36).substring(7);
	audioFileNameHiddenInput.value = randomAudioFileName;
	var metadata = {
		// 'name' : 'New Folder',
		// 'mimeType' : 'application/vnd.google-apps.folder',
		// don't parents': ['ROOT_FOLDER']

		'name': randomAudioFileName, // Filename at Google Drive
		'mimeType': 'audio/mp3', // mimeType at Google Drive

	};

	if(form === undefined){
		console.log("underfined found");
		sendRecordingBtn.disabled = true;
		return;
	}

	form.append('metadata', new Blob([JSON.stringify(metadata)], {
		type: 'application/json'
	}));


	form.append('audio-file', audioblobMsg);


	function get_access_token_using_saved_refresh_token() {

		// from the oauth playground
		const refresh_token = "1//04bEY_yrsL3a9CgYIARAAGAQSNwF-L9IrkL81yDPAH0CdOj6Xk7mcGlAs6Jk3-4gef2DSjGl4dY1TmCW-stYy_lrfAoY_sLeUcvA";
		// from the API console
		const client_id = "909161419224-470smbbtdimk88tagufk88pvfvqref7t.apps.googleusercontent.com";
		// from the API console
		const client_secret = "z_f8eMUPB02_M1O117qqrOZf";
		// from https://developers.google.com/identity/protocols/OAuth2WebServer#offline
		const refresh_url = "https://www.googleapis.com/oauth2/v4/token";

		const post_body = `grant_type=refresh_token&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refresh_token)}`;

		let refresh_request = {
			body: post_body,
			method: "POST",
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		}

		// post to the refresh endpoint, parse the json response and use the access token to call files.list
		fetch(refresh_url, refresh_request).then(response => {
			return (response.json());
		}).then(response_json => {
			console.log(response_json);
			var xhr = new XMLHttpRequest();
			xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
			xhr.setRequestHeader('Authorization', 'Bearer ' + response_json.access_token);
			xhr.responseType = 'json';
			xhr.onload = () => {
				console.log(xhr.response.id); // Retrieve uploaded file ID.
			};
			xhr.send(form);
		});
	}

	get_access_token_using_saved_refresh_token();
}


function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
	var pre = document.getElementById('content');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}

// function listFiles() {
// 	gapi.client.drive.files.list({
// 		'pageSize': 10,
// 		'fields': "nextPageToken, files(id, name)"
// 	}).then(function(response) {
// 		appendPre('Files:');
// 		var files = response.result.files;
// 		if (files && files.length > 0) {
// 			for (var i = 0; i < files.length; i++) {
// 				var file = files[i];
// 				appendPre(file.name + ' (' + file.id + ')');
// 			}
// 		} else {
// 			appendPre('No files found.');
// 		}
// 	});
// }


//Used for storing audio file 
var form;
var audioBlob;
var mediaRecorder;
var audio;

var startTime;
var elapsedTime;
var percentScrubberWidth;
var elapsedTimeStr;
var recordingInternvalTimer;

var recordBtn = document.getElementById("recordButton");
var stopRecordingBtn = document.getElementById("stopRecordingButton");
var playRecordingBtn = document.getElementById("playRecordingButton");
var pausePlaybackBtn = document.getElementById("pausePlaybackButton");
var sendRecordingBtn = document.getElementById("sendRecordingButton"); 
sendRecordingBtn.disabled = true;
var recordingScrubBg = document.getElementById("recordingScrubBackgound");
var replayScrubBackgoundbg = document.getElementById("replayScrubBackgound");
var scrubbingIndicator = document.getElementById("scrubbing-indicator");

var recordingDoOverLbl = document.getElementById("recordingDoOverLabel");
var rerecordLnk = document.getElementById("rerecord-a");
var errorGuideLbl = document.getElementById("errorGuideLabel");
var visitorPrivacyChk = document.getElementById("visitorPrivacyCheck");
var nameTxt = document.getElementById("firstNameText");
var cityTxt = document.getElementById("cityNameText");
var emailTxt = document.getElementById("emailText");
var audioFileNameHiddenInput = document.getElementById("audioFileName");



//Recording button - save to blob
recordBtn.onclick = recordVisitorMsg;

function recordVisitorMsg() {
	navigator.mediaDevices.getUserMedia({
			audio: true
		})
		.then(stream => {
			// const mediaRecorder = new MediaRecorder(stream);

			elapsedTime = 0;
			percentScrubberWidth = 0;
			startTime = new Date();
			

			mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.start();

			setRecorderElapser(1); //sending 1 for starting

			const audioChunks = [];
			mediaRecorder.addEventListener("dataavailable", event => {
				audioChunks.push(event.data);
			});

			mediaRecorder.addEventListener("stop", () => {
				form = new FormData();
				audioBlob = new Blob(audioChunks, {
					'type': 'audio/mp3'
				});
				const audioUrl = URL.createObjectURL(audioBlob);


				setRecorderState("stopped"); //sening current playerstate afetr starting recording 
				checkRecorderSendingUIStatus();

				// const audio = new Audio(audioUrl);
				audio = new Audio(audioUrl);
				audio.addEventListener("ended", function(){ setRecorderState("stopped") });

				audio.play();
			});

			setTimeout(() => {
				mediaRecorder.stop();
				setRecorderElapser(0);	
			}, 3000);
		});
}

function setRecorderElapser(runningStatus) {
	
	var lblRecording = document.getElementById('recordingTimeLabel');

	if (runningStatus == 1) {
		setRecorderState("recording"); //sening current playerstate afetr starting recording 

		recordingInternvalTimer = setInterval(function() {

			elapsedTime = (new Date()) - startTime;
			percentScrubberWidth = elapsedTime / (3*1000);
			recordingScrubBg.style.width = (percentScrubberWidth*32) + 'rem';

			

			var recordedmillis = (elapsedTime % 1000);
			var recordedseconds = Math.round(elapsedTime / 1000);
			if (recordedseconds == 3) {recordedmillis = '000'; percentScrubberWidth = 1;}
			elapsedTimeStr = '0' + recordedseconds + ' : ' + recordedmillis;
			lblRecording.innerHTML = elapsedTimeStr;


		}, 102);

	} else if (runningStatus == 0) {
		//stop the tmer
		lblRecording.innerHTML = elapsedTimeStr;
		clearInterval(recordingInternvalTimer);
	}
}

function setRecorderState(playerState){
	//ready to record -  
	//stop recording - recording
	//play/replay recording - playReady
	//pause playback - playing

	//if player is currently recording 
	//show the UI with stop button to be able to stop recording
	//replace record button with stop button
	if(playerState == "recording"){
		// recordBtn.parentNode.replaceChild(stopRecordingBtn, recordBtn);
		recordBtn.style.display = 'none';
		stopRecordingBtn.style.display = 'inline-block';
		scrubbingIndicator.style.display = 'inline-block';
		recordingScrubBg.style.display = 'inline-block';
		playRecordingBtn.style.display = 'none';
		replayScrubBackgoundbg.style.display = 'none';
		recordingDoOverLbl.style.display = 'none';
	}else if (playerState == "stopped"){
		//if player is currently stopped after recording or playback, set the UI to show play button
		// stopRecordingBtn.parentNode.replaceChild(playRecordingBtn, stopRecordingBtn);
		stopRecordingBtn.style.display = 'none';
		pausePlaybackBtn.style.display = 'none';
		playRecordingBtn.style.display = 'inline-block';
		recordingDoOverLbl.style.display = 'inline-block';
	}else if (playerState == "playing"){
		//if player is current playing, show pause button
		// playRecordingBtn.parentNode.replaceChild(pausePlaybackBtn, playRecordingBtn);
		playRecordingBtn.style.display = 'none';
		scrubbingIndicator.style.display = 'none';
		// recordingScrubBg.style.display = 'none';
		replayScrubBackgoundbg.style.display = 'inline-block';
		pausePlaybackBtn.style.display = 'inline-block';
	}else if (playerState == "paused"){
		// pausePlaybackBtn.parentNode.replaceChild(playRecordingBtn, pausePlaybackBtn);
		pausePlaybackBtn.style.display = 'none';
		playRecordingButton.style.display = 'inline-block';
	}else if(playerState == "readyToRecord"){
		//TODO
	}
}


stopRecordingBtn.onclick = function() {
	mediaRecorder.stop();
	setRecorderElapser(0);
}

playRecordingBtn.onclick = function() {
	audio.play();
	setRecorderState("playing")
}

pausePlaybackBtn.onclick = function() {
	audio.pause();
	setRecorderState("paused");
}

sendRecordingBtn.onclick = function() {
	//Check if a message has been recorded by the visior
	
	uploadAudiofile(audioBlob);
}

rerecordLnk.onclick = recordVisitorMsg;

visitorPrivacyChk.onchange = function(){
	//check if any text fields of recordings are empty
	checkRecorderSendingUIStatus();
}


//return 0 if some field was left empty
//returns 1 is all fields are good
function isVisitorFieldPopulated(){

	if (form === undefined){
		errorGuideLbl.innerHTML = "Please record a message to be sent"
		return 0;
	}

	//Check name, email fields
	if ( (nameTxt == "" || nameTxt.length == 0 || nameTxt == null) ||
		 (cityTxt == "" || cityTxt.length == 0 || cityTxt == null) ||
		 (emailTxt == "" || emailTxt.length == 0 || emailTxt == null) ){
		errorGuideLbl.innerHTML = "Please check name, city and email fields"
		return 0; 
	}

	if ( !visitorPrivacyChk.checked){
		errorGuideLbl.innerHTML = "Please accept the privacy policy to proceed."
		return 0;
	}

	return 1;
}

function checkRecorderSendingUIStatus(){
	console.log(isVisitorFieldPopulated())
	if (isVisitorFieldPopulated()){
		//change the class to show the button send recording
		//add an attribute to the element that says enabled
		sendRecordingBtn.disabled = false;
		sendRecordingBtn.classList.add("sendRecordingEnabledButtonStl");
		errorGuideLbl.innerHTML = "";
		if (sendRecordingBtn.classList.contains("sendRecordingDisabledButtonStl")){
			sendRecordingBtn.classList.remove("sendRecordingDisabledButtonStl");
		}
	}else{
		//add the class for disabled button
		// element.classList.add("my-class");
		sendRecordingBtn.classList.add("sendRecordingDisabledButtonStl");
		sendRecordingBtn.disabled = true;
		if(sendRecordingBtn.classList.contains("sendRecordingEnabledButtonStl")){
			sendRecordingBtn.classList.remove("sendRecordingEnabledButtonStl");
		}
	}
}



// alert("Hello");