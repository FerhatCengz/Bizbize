import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, multiFactor, signInWithPhoneNumber, onAuthStateChanged, signInWithEmailAndPassword, PhoneAuthProvider /* Telefon numarasını doğrular */, PhoneMultiFactorGenerator /* Telefon numarasını kullanıcnın iki faktörlü doğrulamasını etkinleştirmeye yarar */, getMultiFactorResolver /* İki faktörlü doğrulama için oturma açamaya yarar */ } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
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
window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
auth.languageCode = "tr";

const verifier = new RecaptchaVerifier(
  "recaptcha-container",
  {
    callback: (response) => console.log("callback", response),
    size: "normal",
  },
  auth
);

$("#sign-in-button").click(function (e) {
  var userInfo = {
    email: "ferhat.cengiz13@outlook.com",
    password: "123456",
  };
  signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
    .then((userCredential) => {
      console.log(userCredential);
    })
    .catch((error) => {
      if (error.code == "auth/multi-factor-auth-required") {
        const resolver = getMultiFactorResolver(auth, error);
        if (resolver.hints[0].factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
          const phoneInfoOptions = {
            multiFactorHint: resolver.hints[0],
            session: resolver.session,
          };

          const phoneAuthProvider = new PhoneAuthProvider(auth);
          phoneAuthProvider
            .verifyPhoneNumber(phoneInfoOptions, verifier)
            .then(function (verificationId) {
              console.log("id => ", verificationId);

              const verificationCode = prompt("Size gelen 6 Haneli Kodu Yazınız :");
              const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
              const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

              resolver.resolveSignIn(multiFactorAssertion).then((userCredential) => {
                console.log("userCredential => ", userCredential);
                console.log(userCredential);
              });
            })
            .catch((requestIsError) => {
              grecaptcha.reset(window.recaptchaWidgetId);
              recaptchaVerifier.render().then(function (widgetId = "recaptcha-container") {
                grecaptcha.reset(widgetId);
              });
            });
        }
      } else if (error.code == "auth/wrong-password") {
        console.log("diğer sorunlar");
      }
    });
});

/*
const birHesabiIkiFaktorluDogurlamayaTanıma = () => {
  $("#sign-in-button").click(function (e) {
    var userInfo = {
      email: "ferhat.cengiz13@outlook.com",
      password: "123456",
    };
    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userThen) => {
        const user = auth.currentUser;
        multiFactor(user)
          .getSession()
          .then(function (multiFactorSession) {
            const phoneInfoOptions = {
              phoneNumber: "+16505551334",
              session: multiFactorSession,
            };

            const phoneAuthProvider = new PhoneAuthProvider(auth);
            phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, verifier).then(function (verificationId) {
              const verificationCode = prompt("Kodu Girin : ");
              const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
              const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
              multiFactor(user).enroll(multiFactorAssertion, "My personal phone number");
            });
          });
      })
      .catch((err) => {});
  });
};

*/
