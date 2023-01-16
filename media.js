import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { getStorage, ref, uploadString, uploadBytesResumable /*Bu dosyayı yüklerken duraklatama sürdürme iptal etme gibi vs şeyleri ele alıyor*/, getDownloadURL, deleteObject, listAll } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAc02M_2Ofx0NJVYUo6lCOeojIuOrGPi_s",
  authDomain: "fir-todolist-8d567.firebaseapp.com",
  databaseURL: "https://fir-todolist-8d567-default-rtdb.firebaseio.com",
  projectId: "fir-todolist-8d567",
  storageBucket: "fir-todolist-8d567.appspot.com",
  messagingSenderId: "778315616968",
  appId: "1:778315616968:web:942ea7fdccbd15191d0bfd",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

$(document).ready(function () {
  $("#proggcessContainer").hide();

  $("#fileSend").hide();

  $("#fileUpload").click(function (e) {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
    $("#proggcessContainer").hide();
    $("#fileSend").hide();

    $("input[type=file]").change(function (e) {
      $("#proggcessContainer").show(500);

      const files = fileInput.files[0];
      var metadata = {
        contentType: files.type,
      };

      const storageRef = ref(storage, "FCCHAT_FOLDER/" + new Date().getTime() + "_" + files.name);
      const uploadTask = uploadBytesResumable(storageRef, files, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          document.getElementById("proggcessLoad").style = `width: ${progress}%`;

          switch (snapshot.state) {
            case "cancel":
              console.log("Upload is cancel");
              break;
            default:
              console.log("default");
              break;
          }
        },
        (error) => {
          console.log("error.code =>", error.code);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            $("#fileSend").show(500);
            localStorage.setItem(
              "updateFilePath",
              JSON.stringify({
                fileURL: downloadURL,
                fileInfo: {
                  fileName: files.name,
                  fileType: files.type,
                },
              })
            );
          });
        }
      );

      $("#fileCancel").click((e) => {
        uploadTask.cancel();
        document.getElementById("proggcessLoad").style = `width:0%`;
        $("#proggcessContainer").hide(500);
      });
    });
  });
});

// FileSend
// $("#fileSend").hide()
// $("#proggcessContainer").hide(500);
function displayFileType(fileInput) {
  var file = fileInput.files[0];
  var fileType = file.name.split(".").pop();
  var fileTypeCard = document.getElementById("fileTypeCard");
  var fileTypeIcon = document.getElementById("fileTypeIcon");
  var fileTypeSpan = document.getElementById("fileType");

  switch (fileType) {
    case "pdf":
      fileTypeIcon.classList.add("fa-file-pdf");
      break;
    case "doc":
      fileTypeIcon.classList.add("fa-file-word");
      break;
    case "jpg":
      fileTypeIcon.classList.add("fa-file-image");
      break;
    default:
      fileTypeIcon.classList.add("fa-file");
      break;
  }

  fileTypeSpan.innerHTML = fileType;
  fileTypeCard.classList.remove("d-none");
}
