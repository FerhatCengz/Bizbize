//Firebase api ayarları
var config = {
   apiKey: "AIzaSyArCzuo1W4wnmoYrShu7RyTtlLVMxk01i0",
  authDomain: "fir-rtc-adcae.firebaseapp.com",
  projectId: "fir-rtc-adcae",
  storageBucket: "fir-rtc-adcae.appspot.com",
  messagingSenderId: "800378018213",
  appId: "1:800378018213:web:e5dac34d0e8d150a18704c"
/*  apiKey: "AIzaSyAc02M_2Ofx0NJVYUo6lCOeojIuOrGPi_s",
  authDomain: "fir-todolist-8d567.firebaseapp.com",
  databaseURL: "https://fir-todolist-8d567-default-rtdb.firebaseio.com",
  projectId: "fir-todolist-8d567",
  storageBucket: "fir-todolist-8d567.appspot.com",
  messagingSenderId: "778315616968",
  appId: "1:778315616968:web:942ea7fdccbd15191d0bfd",
  */
};
firebase.initializeApp(config);
let db = firebase.database();

window.addEventListener("load", () => {
  //Bildirim desteği tarayıcıda var mı kontrol edeceğiz.
  if (!window.Notification) return;

  // console.log("Notification.permission= > ",Notification.permission);
});


//Mesaj attıktan sonra scrollu son mesaja çekmek için yapılandırılmıştır.
const scrollDownEnd = () => {
  var objDiv = document.getElementById("messageBody");
  objDiv.scrollTop = objDiv.scrollHeight + 1000;
};
//Bildirim gönderirken yapılandırılan ayarlar.
const sendNotifaciton = (userName, mesajContent, userImage) => {
  let notification = new Notification(userName + " Bir Mesaj Gönderdi", {
    body: mesajContent,
    icon: userImage,
  });
  notification.onclick = () => {
    window.location.href = "index.html";
  };
};
//Vue.js başlangıç
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

      //Tüm meajları getirir
      getAllMessage: {},
      //Tüm kullanıcıları getirir
      userAllInfo: {},
      //Çevrim içi sayısını gösterir
      onlieUserCount: 0,
    };
  },

  methods: {
    //Kullanıcının çıkış yapmasını sağlayan fonksiyon
    userLogOut() {
      const logOutConClose = {
        online: false,
        endWithDate: firebase.database.ServerValue.TIMESTAMP,
      };
      Object.assign(this.userInfo, logOutConClose);
      db.ref("FCCHATONLINE").child(this.userInfo.userID).set(this.userInfo);

      firebase
        .auth()
        .signOut()
        .then((result) => {
          Swal.fire("Oturum Kapatıldı", "", "success");
        })
        .catch((err) => {
          Swal.fire("Oturum Kapanamadı !", "", "error");
        });
    },
    //Giriş Yap
    authLogin(processLogin) {
      if (processLogin == "Google") {
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase
          .auth()
          .signInWithPopup(provider)
          .then(function (result) {
            // code which runs on success
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

    //Profili güncelle
    profileSetting() {
      Swal.fire({
        title: "Profil Fotoğrafını Değiştir",
        text: "Modal with a custom image.",
        imageUrl: this.userInfo.userProfil,
        html: `
        <p id='percent'></p>
        <input type="file" class="form-control" id="userFileProfile" accept="image/*"/>

        `,
        confirmButtonText: "Fotoğrafı Kaydet",
        preConfirm: () => {
          //Kodla :
          const ref = firebase.storage().ref();
          const file = document.getElementById("userFileProfile").files[0];
          const metaData = {
            contentType: file.type,
          };

          var uploadTask = ref.child("FCUSERPROFILE/" + file.name + "_" + new Date().getTime()).put(file, metaData);

          uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
              var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              console.log(progress);
              $("#percent").text(progress + " %");
            },
            (error) => {
              console.log(error.message);
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                const user = firebase.auth().currentUser;
                
                $("#percent").text("");
                user
                  .updateProfile({
                    photoURL: downloadURL,
                  })
                  .then(() => {
                    Swal.fire("Profiliniz Güncellendi !", "", "success");
                    this.userAllInfo[this.userInfo.userID].userProfil = downloadURL;
                    this.userInfo.userProfil = downloadURL;
                    db.ref("FCCHATONLINE").child(this.userInfo.userID).set(this.userAllInfo[this.userInfo.userID]);
                  })
                  .catch((error) => {
                    console.log(error.message);
                    Swal.fire("Profile Güncellenirken Bir Hata Oluştu !", "", "warning");
                  });
              });
            }
          );
        },
      });
    },

    //Kullanıcnın giriş ve çıkışlarını kontrol ederek Offline ve Online Etme Durumu
    onlineORoffline() {
      db.ref("FCCHATONLINE").on("value", (data) => {
        this.userAllInfo = data.val();
      });

      //Kullanıcı Online Yap

      var myConnectionsRef = firebase.database().ref("FCCHATONLINE/" + this.userInfo.userID);
      let onlineCountUserFirebaseRef = db.ref("OnlineCountUser/" + this.userInfo.userID);

      var connectedRef = firebase.database().ref(".info/connected");
      connectedRef.on("value", (snap) => {
        if (snap.val() === true) {
          //Veri yaz
          Object.assign(this.userInfo, { online: true });
          myConnectionsRef.set(this.userInfo);
          onlineCountUserFirebaseRef.push("Çevirim İçi");

          //! Bağlantı Koptuğunda Mevcut veriyi kaldırır
          myConnectionsRef.onDisconnect().remove();

          // Bağlantı Koptuğunda herhangi bir yere bir veri yazdırır.
          const connClose = {
            online: false,
            endWithDate: firebase.database.ServerValue.TIMESTAMP,
          };
          //?Son görülme sayısını güncelleyeceksin
          Object.assign(this.userInfo, connClose);
          myConnectionsRef.onDisconnect().set(this.userInfo);
          onlineCountUserFirebaseRef.onDisconnect().remove();
        }
      });

      //Kaç kişi aktif yansıt
      db.ref("OnlineCountUser").on("value", (data) => {
        this.onlieUserCount = Object.keys(data.val()).length;
      });
    },

    //Giriş Yapan Kullanıcının Mesaj Gönderim İşlemini Sağlayan Bir Fonksiyon
    sendMessage() {
      this.userChat.File = "";
      this.userChat.fileURL = "";
      let idKey = db.ref().child("FCCHAT").push().key;
      db.ref("FCCHAT/" + idKey)
        .child(this.userInfo.userID)
        .set(this.userChat);

      this.userChat.userMessage = "";
    },

    
    //Belge resim vs. gibi şeyleri seçtikten sonra gönderme işlemi yapan fonksiyon
    fileSendButton() {
      const fileInputInfo = JSON.parse(localStorage.getItem("updateFilePath"));
      const fileType = JSON.parse(localStorage.getItem("updateFilePath")).fileInfo.fileType.split("/")[0];
      let fileHTML = `
      <div id="fileTypeCard" class="card w-25 rounded">
             <a href="${fileInputInfo.fileURL}">
                 <div class="card-body bg-dark text-white rounded">
                 
                 <i id="fileTypeIcon" class="ml-3 mr-1 fa-solid fa-file"></i>
                 <span id="fileType">
                     <small class="mr-5 ml-2">${fileInputInfo.fileInfo.fileName}</small>
                 </span>
                 </div>
             </a>
      </div>
      `;

      if (fileType === "image") {
        fileHTML = `
        <a href="${fileInputInfo.fileURL}">
            <img src="${fileInputInfo.fileURL}" style='max-width: 600px; height:350px;'/>
        </a>
        `;
      } else if (fileInputInfo.fileInfo.fileType === "video/mp4") {
        fileHTML = `
        <video width="400" controls>
          <source src="${fileInputInfo.fileURL}" type="video/mp4">
        </video>
        `;
      }

      Object.assign(this.userChat, { File: fileHTML, fileURL: fileInputInfo.fileURL });
      let idKey = db.ref().child("FCCHAT").push().key;
      db.ref("FCCHAT/" + idKey)
        .child(this.userInfo.userID)
        .set(this.userChat);

      this.userChat.userMessage = "";
      localStorage.removeItem("updateFilePath");
      $("#fileSend").hide(500);
      $("#proggcessContainer").hide();
    },

    
    //Son mesajı getirir ve bildirim eğer son mesaj atan kişi haricinde diğer kişilere gider.
    getAllMessageOnFirebase() {
      let endUserMessageUserID = [];
      db.ref("FCCHAT")
        .orderByChild("timestamp")
        .limitToLast(1)
        .on("child_added", function (snapshot) {
          // Son ekleyen kullanıcnın idsi :
          endUserMessageUserID[0] = Object.keys(snapshot.val())[0];
          endUserMessageUserID[1] = snapshot.val();
        });

      db.ref("FCCHAT").on("value", (data) => {
        this.getAllMessage = data.val();
        console.log(this.getAllMessage);
        setTimeout(() => {
          if (this.userInfo.userID !== endUserMessageUserID[0]) {
            //Mesaj Göster
            // console.log(endUserMessageUserID);
            Notification.requestPermission().then(sendNotifaciton(this.userInfo.displayName, endUserMessageUserID[1].userMessage, this.userInfo.userProfil));
          }

          scrollDownEnd();
        }, 500);
      });
    },
  },

  mounted() {
    //Kaç kişi aktif

    // Gooogle İle Giriş
    // Önce Google hesabı ile auth edilmiş mi yoksa edilmemiş mi diye kontrol edeceğiz :

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.userInfo.displayName = user.displayName;
        this.userInfo.userProfil = user.photoURL || "https://cdn-icons-png.flaticon.com/512/16/16363.png?w=740&t=st=1673143475~exp=1673144075~hmac=e44e04eee15eb4e95a601fe644aa8a82b4e52fa45c600b430be3a6a31721eb14";
        this.userInfo.userID = user.uid;
        this.getAllMessageOnFirebase();
        this.onlineORoffline();
      } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(function (result) {
            $("#myModal").modal("toggle");
          })
          .catch(function (error) {
            $("#myModal").modal();
            Swal.fire("Google Hesabınıza Bağlanırken Sorun Oluştu Lütfen Bağlanmaya Tekrar Çalışın", "VE YA BİR DİĞER ALTERNETİF OLARAK MAİL ADRESİNİ VE ŞİFRENİZİ GİREREEK SAĞLAYABİLİRSİNİZ VE YA GOOGLE HESABINIZ İÇİN KOLAY BİR YOLDAN GİRİŞ YAPMAK İÇİN TEKRAR 'GOOGLE İLE GİRİŞ YAP BUTTONUNA TIKLAYIP İŞLEMİNİZİ GERÇEKLEŞTİREBİLİRSİNİZ.' ", "warning");
          });
      }
    });
  },
});

app.mount("#chatApp");
