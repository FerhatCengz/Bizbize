//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording
var globalBlob = null;
// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
  $("#myAudio").hide();
  $("#btnVoiceSend").hide();
  console.log("recordButton clicked");

  /*
          Simple constraints object, for more advanced audio features see
          https://addpipe.com/blog/audio-constraints-getusermedia/
      */

  var constraints = { audio: true, video: false };

  /*
          Disable the record button until we get a success or fail from getUserMedia() 
      */

  recordButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false;

  /*
          We're using the standard promise based getUserMedia() 
          https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      */

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

      /*
              create an audio context after getUserMedia is called
              sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
              the sampleRate defaults to the one set in your OS for your playback device
  
          */
      audioContext = new AudioContext();

      //update the format
      // document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz";

      /*  assign to gumStream for later use  */
      gumStream = stream;

      /* use the stream */
      input = audioContext.createMediaStreamSource(stream);

      /* 
              Create the Recorder object and configure to record mono sound (1 channel)
              Recording 2 channels  will double the file size
          */
      rec = new Recorder(input, { numChannels: 1 });

      //start the recording process
      rec.record();

      console.log("Recording started");
    })
    .catch(function (err) {
      //enable the record button if getUserMedia() fails
      recordButton.disabled = false;
      stopButton.disabled = true;
      pauseButton.disabled = true;
    });
}

function pauseRecording() {
  console.log("pauseButton clicked rec.recording=", rec.recording);
  if (rec.recording) {
    //pause
    rec.stop();
    // pauseButton.innerHTML = "Resume";
    pauseButton.classList = "fa-solid fa-play btn btn-warning text-white";
  } else {
    //resume
    rec.record();
    pauseButton.classList = "fa-solid fa-pause btn btn-warning text-white";
  }
}

function stopRecording() {
  console.log("stopButton clicked");

  //disable the stop button, enable the record too allow for new recordings
  stopButton.disabled = true;
  recordButton.disabled = false;
  pauseButton.disabled = true;

  //reset button just in case the recording is stopped while paused
  // pauseButton.innerHTML = "Pause";
  pauseButton.classList = "fa-solid fa-pause btn btn-warning text-white";
  //tell the recorder to stop the recording
  rec.stop();

  //stop microphone access
  gumStream.getAudioTracks()[0].stop();

  //create the wav blob and pass it on to createDownloadLink
  rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
  globalBlob = blob;
  $("#btnVoiceSend").removeClass("d-none");
  var url = URL.createObjectURL(blob);
  var au = document.createElement("audio");

  au.controls = true;
  au.src = url;
  au.id = "myAudio";
  $("#recordingsList").html(au);
  $("#btnVoiceSend").show();
}

$("#voiceStart").click(function (e) {
  $("#recordButton").click();
  $("#voiceStart").hide();
  $("#sendButton").hide();
  $("#fileUpload").hide();
  $("#messageText").hide();
  $("#controls").removeClass("d-none");
});

$("#btnVoiceSend").click(() => {
  $("#voiceStart").show();
  $("#sendButton").show();
  $("#fileUpload").show();
  $("#messageText").show();
  $("#controls").addClass("d-none");

  $("#voiceStart").removeClass("fa-solid fa-microphone");
  const ref = firebase.storage().ref();
  const file = globalBlob;
  const task = ref.child("SesKayit" + "/" + new Date().getTime()).put(file);
  task.on("state_changed", (snapshot) => {
    var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    console.log(progress);
    console.log(snapshot);
    $("#voiceStart").text(progress + " %");
    if (progress == 100) {
      $("#loadingSpinner").addClass("d-none");
      $("#btnVoiceSend").removeClass("d-none");
      setTimeout(() => {
        $("#voiceStart").addClass("fa-solid fa-microphone");
        $("#voiceStart").text("");

        snapshot.ref
          .getDownloadURL()
          .then((downloadURL) => {
            let idKey = db.ref().child("FCCHAT").push().key;
            db.ref("FCCHAT")
              .child(idKey)
              .child(firebase.auth().currentUser.uid)
              .set({
                File: `
        <audio controls>
          <source src="${downloadURL}"> type="audio/ogg" >
      </audio>

        `,
                fileUrl: downloadURL,
                messageDate: new Date().toLocaleString(),
                userMessage: "",
              });
          })
          .catch((err) => {
            console.log(err.message);
          });
      }, 1000);
    }
  });
});
