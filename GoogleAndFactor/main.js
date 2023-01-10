import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  multiFactor,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  PhoneAuthProvider /* Telefon numarasını doğrular */,
  PhoneMultiFactorGenerator /* Telefon numarasını kullanıcnın iki faktörlü doğrulamasını etkinleştirmeye yarar */,
  getMultiFactorResolver /* İki faktörlü doğrulama için oturma açamaya yarar */,
  GoogleAuthProvider,
  signInWithPopup /* Giriş yapılacak google facebook vs. gibi siteler için bir modal açar */,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAc02M_2Ofx0NJVYUo6lCOeojIuOrGPi_s",
  authDomain: "fir-todolist-8d567.firebaseapp.com",
  databaseURL: "https://fir-todolist-8d567-default-rtdb.firebaseio.com",
  projectId: "fir-todolist-8d567",
  storageBucket: "fir-todolist-8d567.appspot.com",
  messagingSenderId: "778315616968",
  appId: "1:778315616968:web:942ea7fdccbd15191d0bfd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "tr";

const verifier = new RecaptchaVerifier(
  "recaptcha-container",
  {
    callback: (response) => console.log("response => ", response),
    size: "normal",
  },
  auth
);

// $("#sign-in-button").click(function (e) {
//   var userInfo = {
//     email: "ferhatcengiz13@icloud.com",
//     password: "123456",
//   };
//   signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
//     .then((userThen) => {
//       const user = auth.currentUser;
//       multiFactor(user)
//         .getSession()
//         .then(function (multiFactorSession) {
//           const phoneInfoOptions = {
//             phoneNumber: "+16505556513",
//             session: multiFactorSession,
//           };
//           const phoneAuthProvider = new PhoneAuthProvider(auth);
//           phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verifier).then(function (verificationId) {
//             const verificationCode = prompt("Kodu Girin : ");
//             const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
//             const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
//             multiFactor(user).enroll(multiFactorAssertion, "Yetki A");
//           });
//         });
//     })
//     .catch((err) => {});
// });

$("#sign-in-button").click(function (e) {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  /*
    Rolendirme olarak tanımlanabilir belki bilemedim 🤔

    provider.setCustomParameters({
    'login_hint': 'user@example.com'
  });
    */

  signInWithPopup(auth, provider)
    .then((result) => {
      //Giriş yaparken İki faktörlü doğrulmayı direkt olarak etklinleştirelim.
      const user = auth.currentUser;

      multiFactor(user)
        .getSession()
        .then((multiFactorSession) => {
          const phoneNumberInfo = {
            phoneNumber: "+16505555555",
            session: multiFactorSession,
          };
          const provider = new PhoneAuthProvider();
          provider
            .verifyPhoneNumber(phoneNumberInfo, verifier)
            .then((verificationId) => {
              const verifyCode = prompt("Size gelen 6 Haneli Kodu Girinşiz . ");
              const cred = PhoneAuthProvider.credential(verificationId, verifyCode);
              const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
              multiFactor(user).enroll(multiFactorAssertion, "Yetki 1");
            })
            .catch((err) => {
              console.log(err.message);
            });
        })
        .catch((err) => {});
    })
    .catch((error) => {
      console.log(error);
    });
});
