import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

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
const refStorage = ref(storage, "");

listAll(refStorage)
  .then((result) => {
    Object.keys(result.items).forEach((dataKeys) => {
      getDownloadURL(ref(storage, result.items[dataKeys].fullPath))
        .then((result) => {
          console.log("dow => ", result);
        })
        .catch((err) => {});
    });
  })
  .catch((err) => {});

// getDownloadURL(refStorage)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {});

//   deleteObject(refStorage).then((result) => {
//     console.log(result);
//   }).catch((err) => {

//   });

//Böyle bir klasörü refeans alır

$(document).ready(function () {
  $("#uploadFileButton").click(function (e) {
    const fileInput = document.getElementById("fileInput").files[0];
    const identityFileName = new Date().getTime() + "_" + fileInput.name;
  });
});

$("#sign-in-button").click(function (e) {
  girisYap();
  // cikisYaP();

  onAuthStateChanged(auth, (userCredit) => {
    if (userCredit) {
      console.log("User Var !");
    } else {
      console.log("Yok !");
    }
  });
});

$("#uploadFileButtonURL").click(function (e) {
  const storageRef = ref(storage, "referansDenemesi/" + "url");

  const message4 = "data:image/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
  uploadString(storageRef, message4, "data_url").then((snapshot) => {
    console.log("Uploaded a data_url string!");
  });
});
const girisYap = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const cikisYaP = () => {
  auth.signOut();
};

const yuzdelikHesap = (yuzde) => {
  document.getElementById("progressBar").style = `width: ${yuzde}%`;
  $("#pLoading").text("% " + yuzde);
  //   var bar1 = new ldBar("#myItem1");
  //   /* ldBar stored in the element */
  //   var bar2 = document.getElementById("myItem1").ldBar;
  //   bar1.set(yuzde);
};
//Bu klasörüün bir üstünü referans almak için Parent kullanılabilir

// const imageRefParent = storageRef.parent; // Bir üstünü alır

//Veya dosyanın en kök yolunu almak için ise root diyebiliriz
// const imagesRoot = imageRefParent.root;

const fotografYukle = () => {
  const storageRef = ref(storage, "referansDenemesi/" + identityFileName);

  //Yükleme görevini üstleenecek bir değişken tasarlıyoruz
  const uploadTask = uploadBytesResumable(storageRef, fileInput);

  uploadTask.on("state_changed", (snapshot) => {
    console.log("snapshot => ", snapshot);
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    yuzdelikHesap(Math.floor(progress));
    console.log("Upload is " + progress + "% done");
    console.log("snapshot.state => ", snapshot.state);
  });
  //? Pause the upload
  // uploadTask.pause();

  //? Resume the upload
  // uploadTask.resume();

  //? Cancel the upload
  // uploadTask.cancel();

  /*
    //*Sıradan Bir Yükleme
    const message = "This is my message.";
    uploadString(storageRef, message).then((snapshot) => {
      console.log(snapshot);
      console.log("Uploaded a raw string!");
   */

  /*
    //*İptal etmek ve yahut durdurmak sürdürmek gibi işlevlere örnek : 
    
    //!Yükleme görevini üstleenecek bir değişken tasarlıyoruz
    const uploadTask = uploadBytesResumable(storageRef, identityFileName);
         setTimeout(() => {
    //   uploadTask.cancel();
      console.log("iptal !");
    }, 100);
    setTimeout(() => {
      uploadTask.pause();

      console.log("durdur");
    }, 1000);
    setTimeout(() => {
      uploadTask.resume();
      console.log("devam etti");
    }, 1500);
      */
};
