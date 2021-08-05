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
	var metadata = {
		// 'name' : 'New Folder',
		// 'mimeType' : 'application/vnd.google-apps.folder',
		// don't parents': ['ROOT_FOLDER']

		'name': 'sampleName', // Filename at Google Drive
		'mimeType': 'audio/mp3', // mimeType at Google Drive

	};

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
var form = new FormData();


//Recording button - save to blob
document.getElementById("recordButton").onclick = function() {
	navigator.mediaDevices.getUserMedia({
			audio: true
		})
		.then(stream => {
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.start();

			const audioChunks = [];
			mediaRecorder.addEventListener("dataavailable", event => {
				audioChunks.push(event.data);
			});

			mediaRecorder.addEventListener("stop", () => {
				const audioBlob = new Blob(audioChunks, {
					'type': 'audio/mp3'
				});
				const audioUrl = URL.createObjectURL(audioBlob);


				console.log(form);
				uploadAudiofile(audioBlob);

				const audio = new Audio(audioUrl);
				audio.play();
			});

			setTimeout(() => {
				mediaRecorder.stop();
			}, 3000);
		});
}



// alert("Hello");