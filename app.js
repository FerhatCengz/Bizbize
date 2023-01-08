var config = {
  apiKey: "AIzaSyAc02M_2Ofx0NJVYUo6lCOeojIuOrGPi_s",
  authDomain: "fir-todolist-8d567.firebaseapp.com",
  databaseURL: "https://fir-todolist-8d567-default-rtdb.firebaseio.com",
  projectId: "fir-todolist-8d567",
  storageBucket: "fir-todolist-8d567.appspot.com",
  messagingSenderId: "778315616968",
  appId: "1:778315616968:web:942ea7fdccbd15191d0bfd",
};

window.onbeforeunload = function (event) {
  var message = "Important: Please click on 'Save' button to leave this page.";
  if (typeof event == "undefined") {
    event = window.event;
  }
  if (event) {
    event.returnValue = message;
  }
  return message;
};

firebase.initializeApp(config);
let db = firebase.database();

db.ref("FCCHATONLINE/online").on("value", (data) => {
  $("#onlineCount").text(data.val() + 1);
});
window.addEventListener("load", () => {
  //Bildirim desteği tarayıcıda var mı kontrol edeceğiz.
  if (!window.Notification) return;

  // console.log("Notification.permission= > ",Notification.permission);
});

const scrollDownEnd = () => {
  var objDiv = document.getElementById("messageBody");
  objDiv.scrollTop = objDiv.scrollHeight + 1000;
};

const sendNotifaciton = (userName, mesajContent, userImage) => {
  let notification = new Notification(userName + " Bir Mesaj Gönderdi", {
    body: mesajContent,
    icon: userImage,
  });
  notification.onclick = () => {
    window.location.href = "index.html";
  };
};

const app = Vue.createApp({
  data() {
    return {
      //Giriş Yapan Kullanıcının Bilgilerini Kapsayan Obje
      userInfo: {
        displayName: "",
        userProfil: "",
        userID: "",
      },
      //Giriş Yapan Kullanıcnın Mesajlar Bilgilerini Yansıtan Obje
      userChat: {
        userMessage: "",
        messageDate: new Date().toLocaleString(),
      },

      getAllMessage: {},
      userAllInfo: {},
    };
  },

  methods: {
    //Giriş Yap
    authLogin(processLogin) {
      if (processLogin == "Google") {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(function (result) {
            if (user) {
              this.userInfo.displayName = user.displayName;
              this.userInfo.userProfil = user.photoURL;
              this.userInfo.userID = user.uid;
              this.getAllMessageOnFirebase();
            }
          })
          .catch(function (error) {
            Swal.fire("Google Hesabınıza Bağlanılamadı", "", "warning");
          });
      } else {
        const mail = $.trim($("#Mail").val());
        const password = $.trim($("#Password").val());
        firebase
          .auth()
          //Auth eder.
          .signInWithEmailAndPassword(mail, password)
          .then(() => {
            $("#myModal").modal("toggle");
          })
          .catch((data) => {
            alert("KULLANICI ADI VE YA ŞİFRE HATALI !");
          });
      }
    },

    //Kullanıcnın giriş ve çıkışlarını kontrol ederek Offline ve Online Etme Durumu
    onlineORoffline(useruid) {
      db.ref("FCCHATONLINE").on("value", (data) => {
        this.userAllInfo = data.val();
      });

      //Kullanıcı Online Yap
      Object.assign(this.userInfo, { online: true });
      db.ref("FCCHATONLINE").child(useruid).set(this.userInfo);

      db.ref("FCCHATONLINE/online").once("value", (data) => {
        db.ref("FCCHATONLINE")
          .child("online")
          .set(data.val() + 1);
      });

      //Kullanıcı Offline
      window.addEventListener("beforeunload", (event) => {
        event.preventDefault();

        // Add data to Firebase
        Object.assign(this.userInfo, { online: false });
        db.ref("FCCHATONLINE").child(useruid).set(this.userInfo);
        db.ref("FCCHATONLINE/online").once("value", (data) => {
          if (data.val() >= 0) {
            db.ref("FCCHATONLINE")
              .child("online")
              .set(data.val() - 1);
          }
        });
      });
    },

    //Giriş Yapan Kullanıcının Mesaj Gönderim İşlemini Sağlayan Bir Fonksiyon
    sendMessage() {
      let idKey = db.ref().child("FCCHAT").push().key;
      db.ref("FCCHAT/" + idKey)
        .child(this.userInfo.userID)
        .set(this.userChat);
      Notification.requestPermission().then(sendNotifaciton(this.userInfo.displayName, this.userChat.userMessage, this.userInfo.userProfil));
      this.userChat.userMessage = "";
    },

    getAllMessageOnFirebase() {
      db.ref("FCCHAT").on("value", (data) => {
        this.getAllMessage = data.val();
        console.log(this.getAllMessage);
        setTimeout(() => {
          scrollDownEnd();
        }, 500);
      });
    },
  },
  mounted() {
    // Gooogle İle Giriş
    //Önce Google hesabı ile auth edilmiş mi yoksa edilmemiş mi diye kontrol edeceğiz :

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userInfo.displayName = user.displayName;
        this.userInfo.userProfil = user.photoURL || "https://cdn-icons-png.flaticon.com/512/16/16363.png?w=740&t=st=1673143475~exp=1673144075~hmac=e44e04eee15eb4e95a601fe644aa8a82b4e52fa45c600b430be3a6a31721eb14";
        this.userInfo.userID = user.uid;
        this.getAllMessageOnFirebase();
        this.onlineORoffline(user.uid);
      } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(function (result) {})
          .catch(function (error) {
            $("#myModal").modal();
            Swal.fire("Google Hesabınıza Bağlanılamadı", "", "warning");
          });
      }
    });
  },
});

app.mount("#chatApp");
