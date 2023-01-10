import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getStorage, ref, list, listAll } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
// Add Firebase products that you want to use
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, sendEmailVerification /*Doğrulama E Postası*/, reauthenticateWithCredential, sendSignInLinkToEmail, updatePhoneNumber, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
auth.useDeviceLanguage();

window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container");

recaptchaVerifier.render().then((widgetID) => {
  window.recaptchaVerifier = widgetID;
});



$("#getCodeButton").click(function (e) {

});

// auth
//   .getUser("hOgiIVyncRdGRvd6k5ikuKMgwtS2")
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

//Kullanıcıyı Silmek
// const auth = getAuth();
// const user = auth.currentUser;

// deleteUser(user).then(() => {
//   // User deleted.
// }).catch((error) => {
//   // An error ocurred
//   // ...
// });

//Parola Güncellemek.
// const user = auth.currentUser;
// const newPassword = getASecureRandomPassword();

// updatePassword(user, newPassword).then(() => {
//   // Update successful.
// }).catch((error) => {
//   // An error ocurred
//   // ...
// });

//E Posta Doğrulama Onayı Göndermek
//onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log("auth.currentUser => ", auth.currentUser);
//     sendEmailVerification (auth.currentUser).then((result) => {
//       console.log("Gönderildi");
//     }).catch((err) => {
//       console.log(err.message);
//     });

//   }
// });

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log("auth.currentUser => ", auth.currentUser);
//     updateProfile(auth.currentUser, {
//       displayName: "Ferhat Cengiz Outlook", photoURL : "https://avatars.githubusercontent.com/u/79553498?v=4"
//     });
//     console.log(user.providerData[0]);
//   }
// });

// özel bilgileri getirir ad numara photo isim vs . console.log(user.providerData);
// signInWithEmailAndPassword(auth, "ferhat.cengiz13@outlook.com", "123456")
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

//Kayıt ekleme
// createUserWithEmailAndPassword(auth, "ferhatmodul@gmail.com", "123455")
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// const storage = getStorage();
// // Create a reference under which you want to list
// const listRef = ref(storage, "");
// // Find all the prefixes and items.
// listAll(listRef)
//   .then((res) => {
//     res.prefixes.forEach((folderRef) => {
//       console.log("folderRef => ", folderRef);
//       // All the prefixes under listRef.
//       // You may call listAll() recursively on them.
//     });
//     res.items.forEach((itemRef) => {
//       console.log("itemRef => ", itemRef);

//       itemRef.getDownloadURL().then((img) => {
//         console.log("img => ", img);
//       });
//       // All the items under listRef.
//     });
//   })
//   .catch((error) => {
//     // Uh-oh, an error occurred!
//   });
