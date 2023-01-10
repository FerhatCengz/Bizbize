import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, sendEmailVerification, createUserWithEmailAndPassword, sendSignInLinkToEmail, signInWithEmailAndPassword, onAuthStateChanged, updatePhoneNumber, RecaptchaVerifier, PhoneAuthProvider, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
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

const email = "ferhat.cengiz13@outlook.com";
const password = "123456";
const appVerifier = window.recaptchaVerifier;






/*


      Bunlar oturum açıldıktan sonra yapılır ....
     E posta Doğrulama Kodu
    
    
     sendEmailVerification(auth.currentUser).then((result) => {
      console.log("sucess");
    }).catch((err) => {
      console.log(err.message);
    });
    */
