import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("user zaten mevcut =>", user);
  } else {
    console.log("böyle bir user yok giriş yap");
    const phoneNumber = "+905426575124";
    const appVerifier = window.recaptchaVerifier;

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "normal",
        callback: (response) => {
          console.log("callback response => ", response);
        },
        "expired-callback": (responseExpired) => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log("responseExpired => ", responseExpired);
        },
      },
      auth
    );

    $("#sign-in-button").click(function (e) {
      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).

          console.log("mesaj gönderildi => ", confirmationResult);
          const code = prompt("Gelen Mesaj Kodunuz : ");
          confirmationResult
            .confirm(code)
            .then((success) => {
              console.log("auth success => ", success);
            })
            .catch((err) => {
              console.log("err => ", err.message);
            });

          //   window.confirmationResult = confirmationResult;
          // ...
        })
        .catch((error) => {
          // Error; SMS not sent
          // ...
          console.log(error.message);
        });
    });
  }
});
// recaptchaVerifier.render().then((widgetId = "recaptcha-container") => {
//   window.recaptchaWidgetId = widgetId;
//   const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);
//   console.log("recaptcha render => ", recaptchaResponse);
// });
