const firebaseConfig = {
  apiKey: "AIzaSyAc02M_2Ofx0NJVYUo6lCOeojIuOrGPi_s",
  authDomain: "fir-todolist-8d567.firebaseapp.com",
  databaseURL: "https://fir-todolist-8d567-default-rtdb.firebaseio.com",
  projectId: "fir-todolist-8d567",
  storageBucket: "fir-todolist-8d567.appspot.com",
  messagingSenderId: "778315616968",
  appId: "1:778315616968:web:942ea7fdccbd15191d0bfd",
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
//Doğrulaması Recaptcha oluşturuyor
const verifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
  callback: (response) => console.log("callback", response),
  size: "normal",
});

//?Bir kullanıcı eklendiğinde onu önce mail adresini doğrulayacağız sonra gidip onun telefon numarasını doğrulayacağız

$("#sign-in-button").click(function (e) {
  const phoneNumber = "+905426575124";
  const email = "ferhat.cengiz13@outlook.com";
  const password = "123456";

  auth.signInWithEmailAndPassword(email, password).then((result) => {
    console.log("success");
  });
  /*
  auth
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      const user = auth.currentUser;
      console.log(user.providerData);

      //Kullanının telefon numarasını ve mail bilgilerini aynı çatı altında ilişkilendrimek
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber("+1 650-555-1334", verifier)
        .then((id) => {
          console.log("id => ", id);
          //   Kodu Görüntüle ve doğrula
          const code = window.prompt("Size gelen kodu söyleyin");
          const cred = firebase.auth.PhoneAuthProvider.credential(id, code);

          user
            .updatePhoneNumber(cred)
            .then((result) => {
              console.log("phone number changed", id, cred, user);
            })
            .catch((err) => {
              console.log("updatePhoneNumber => ", err.message);
            });
        })
        .catch((err) => {
          console.log("verifyPhoneNumber =>", err.message);
        });

      /*
      Mail adresini onaylamak .
    if (!auth.currentUser.emailVerified) {
      alert("Mail Adresini Onaylamadan Giriş Yapamazsınız !");
      auth.signOut();
    }
     /
    })
    .catch((err) => {
      console.log("signInWithEmailAndPassword => ", err.message);
    });

    */

  //Telefon Doğrulamak İçin Bir Neseneye İhtiyacım var
  //   const phoneProvider = new firebase.auth.PhoneAuthProvider();

  //   auth.createUserWithEmailAndPassword(email, password).then((resultUser) => {
  //     auth.currentUser
  //       .sendEmailVerification()
  //       .then((result) => {
  //         console.log("Mail Adresinizi Kontrol Ediniz");
  //       })
  //       .catch((err) => {
  //         console.log(err.message);
  //       });
  //   });
});

// auth
//   .signInWithEmailAndPassword("ferhat.cengiz13@outlook.com", "123456")
//   .then((result) => {
//     if (!auth.currentUser.emailVerified) {
//       alert("Mail Adresini Onaylamadan Giriş Yapamazsınız !");
//       auth.signOut();
//     }
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// auth.onAuthStateChanged((user) => {
//   console.log("user => ",user);
// });

/*
  Kullanıcnın telefon numarası
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.providerData[0]);
    console.log("Kullanıcının Telefon Numarası => ", user.providerData[0].phoneNumber);
    //Telefon numara sağlayıcısı oluşturur.
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    //Telefon Numarasını Onaylıyor
    phoneProvider
      .verifyPhoneNumber("+905305146313", verifier)
      .then((id) => {
        console.log("id => ", id);
        const code = window.prompt("Size gelen kodu söyleyin");
        const cred = firebase.auth.PhoneAuthProvider.credential(id, code);

        user
          .updatePhoneNumber(cred)
          .then((endGame) => {
            console.log("phone number changed", id, cred, user);
            setSuccess(true);
          })
          .catch((err) => {
            console.log("updatePhoneNumber => ", err.message);
          });
      })
      .catch((err) => {
        console.log("phoneProvider.verifyPhoneNumber => ", err.message);
      });
  } else {
    console.log("user yok !");
  }
});
 */

// //Telefon numara sağlayıcısı oluşturur.
// const phoneProvider = new firebase.auth.PhoneAuthProvider();
// //Telefon Numarasını Onaylıyor
// const id = await phoneProvider.verifyPhoneNumber("+905426575124", verifier);
// console.log("id => ", id);
// // //Kodu Görüntüle ve doğrula
// // const code = window.prompt("Size gelen kodu söyleyin");

// // const cred = firebase.auth.PhoneAuthProvider.credential(id, code);
// // await fuser.updatePhoneNumber(cred);
// // console.log("phone number changed", id, cred, fuser);
// // setSuccess(true);
