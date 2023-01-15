
let rec = null;

rec = new Recorder(input, { numChannels: 1 });


console.log(rec);

// collect DOMs
const display = document.querySelector(".display");
const controllerWrapper = document.querySelector(".controllers");

const State = ["Initial", "Record", "Download"];
let stateIndex = 0;
let mediaRecorder,
  chunks = [],
  audioURL = "";

let blob = null;
const a = navigator.mediaDevices.getUserMedia("");

// mediaRecorder setup for audio
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("mediaDevices supported..");

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        // Blob nesnesi oluştur
        blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });

        chunks = [];
        audioURL = window.URL.createObjectURL(blob);
        document.querySelector("audio").src = audioURL;
        console.log("audioURL =>", audioURL);
        console.log("bir şey oldu !");
        $("#sendButton").hide();
        $("#fileUpload").hide();
        $("#messageText").hide();
      };
    })
    .catch((error) => {
      console.log("Following error has occured : ", error);
    });
} else {
  stateIndex = "";
  application(stateIndex);
}

const clearDisplay = () => {
  display.textContent = "";
};

const clearControls = () => {
  controllerWrapper.textContent = "";
};

const record = () => {
  stateIndex = 1;
  mediaRecorder.start();
  application(stateIndex);
};

const stopRecording = () => {
  stateIndex = 2;
  mediaRecorder.stop();
  application(stateIndex);
};

const downloadAudio = () => {
  const downloadLink = document.createElement("a");
  downloadLink.href = audioURL;
  downloadLink.setAttribute("download", "audio");
  downloadLink.click();
};

const addButton = (id, funString, text, classButton, btnStyle) => {
  const btn = document.createElement("button");
  btn.id = id;
  btn.setAttribute("onclick", funString);
  btn.textContent = text;
  btn.style = btnStyle;
  btn.classList = classButton;
  controllerWrapper.append(btn);
};
const btnFirebaseStroageVoiceSend = () => {
  const btn = document.createElement("button");
  btn.id = "btnSendVoice";
  btn.style = "height : 2.5rem";
  btn.classList = "fa-solid fa-circle-arrow-up btn btn-success ml-5 mr-5";

  controllerWrapper.append(btn);
};

const cancelVoiceButton = () => {
  const btn = document.createElement("button");
  btn.id = "btnCancelVoice";
  btn.style = "height : 2.5rem";
  btn.classList = "fa-solid fa-xmark btn btn-sm btn-danger ml-5 mr-5";

  controllerWrapper.append(btn);
};
const addMessage = (text) => {
  const msg = document.createElement("p");
  msg.textContent = text;
  display.append(msg);
};

const addAudio = () => {
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.src = audioURL;
  display.append(audio);
};

const application = (index) => {
  switch (State[index]) {
    case "Initial":
      clearDisplay();
      clearControls();

      addButton("record", "record()", "", "fa-solid fa-microphone btn btn-info", "height:2.3rem");
      break;

    case "Record":
      clearDisplay();
      clearControls();

      addMessage("Recording...");
      addButton("stop", "stopRecording()", "", "fa-regular fa-circle-stop btn btn-danger btn-sm");

      break;

    case "Download":
      clearControls();
      clearDisplay();
      addAudio();

      addButton("record", "record()", "", "fa-solid fa-rotate-right btn btn-sm");
      cancelVoiceButton();
      btnFirebaseStroageVoiceSend();
      break;

    default:
      clearControls();
      clearDisplay();

      addMessage("Your browser does not support mediaDevices");
      break;
  }
};

application(stateIndex);

$("body").on("click", "#btnCancelVoice", function () {
  $("#sendButton").show();
  $("#fileUpload").show();
  $("#messageText").show();

  chunks = [];
  audioURL = window.URL.createObjectURL(blob);
  document.querySelector("audio").src = audioURL;
  console.log("audioURL =>", audioURL);
  console.log("bir şey oldu !");
  application(0);
});

$("body").on("click", "#btnSendVoice", function () {
  const auth = firebase.auth();
  const ref = firebase.storage().ref();
  const file = blob;
  console.log(blob);

  const metaData = {
    contentType: blob.type,
  };
  const task = ref.child("SesKayit" + "/" + new Date().getTime() + ".ogg").put(file);
  task.then((snapshot) =>
    snapshot.ref
      .getDownloadURL()
      .then((downloadURL) => {
        console.log("downloadURL => ", downloadURL);
        let idKey = db.ref().child("FCCHAT").push().key;
        db.ref("FCCHAT")
          .child(idKey)
          .child(auth.currentUser.uid)
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
      })
  );

  chunks = [];
  audioURL = window.URL.createObjectURL(blob);
  document.querySelector("audio").src = audioURL;
  console.log("audioURL =>", audioURL);
  console.log("bir şey oldu !");

  $("#sendButton").show();
  $("#fileUpload").show();
  $("#messageText").show();
  application(0);
});
