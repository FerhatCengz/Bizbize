window.addEventListener("load", () => {
  //Bildirim desteği tarayıcıda var mı kontrol edeceğiz.
  if (!window.Notification) return;

  // console.log("Notification.permission= > ",Notification.permission);

  Notification.requestPermission().then(sendNotifaciton);
});

const sendNotifaciton = (mesajContent, userImage) => {
  let notification = new Notification("Başlık", {
    body: mesajContent,
    icon: userImage,
  });
  notification.onclick = () => {
    window.location.href = "index.html";
  };
};
