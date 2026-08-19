const firebaseConfig = {
  apiKey: "AIzaSyDaOnBZCE7LPNe-8NqueEB2gzb7nSxMyLo",
  authDomain: "snapcam-c078b.firebaseapp.com",
  databaseURL: "https://snapcam-c078b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "snapcam-c078b",
  storageBucket: "snapcam-c078b.firebasestorage.app",
  messagingSenderId: "68291316614",
  appId: "1:68291316614:web:e8af11e4fcc98ba8833a07"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const camera = document.getElementById("camera");
const startCamera = document.getElementById("startCamera");
const takePhoto = document.getElementById("takePhoto");

const previewSection = document.getElementById("previewSection");
const photoPreview = document.getElementById("photoPreview");
const savePhoto = document.getElementById("savePhoto");
const retake = document.getElementById("retake");

const cameraMessage = document.getElementById("cameraMessage");

let stream = null;
let photoURL = null;

async function openCamera() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraMessage.textContent =
        "Camera is not supported by this browser.";
      return;
    }

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      },
      audio: false
    });

    camera.srcObject = stream;

    cameraMessage.style.display = "none";
    takePhoto.disabled = false;
    startCamera.textContent = "Camera On";

  } catch (error) {
    cameraMessage.style.display = "block";

    if (error.name === "NotAllowedError") {
      cameraMessage.textContent =
        "Camera permission was denied. Please allow camera access.";
    } else {
      cameraMessage.textContent =
        "Could not open camera. Make sure the website uses HTTPS.";
    }
  }
}

startCamera.addEventListener("click", openCamera);

takePhoto.addEventListener("click", function () {

  if (!stream) {
    return;
  }

  const canvas = document.createElement("canvas");

  canvas.width = camera.videoWidth;
  canvas.height = camera.videoHeight;

  const context = canvas.getContext("2d");

  context.drawImage(
    camera,
    0,
    0,
    canvas.width,
    canvas.height
  );

  canvas.toBlob(function (blob) {

    if (!blob) {
      return;
    }

    if (photoURL) {
      URL.revokeObjectURL(photoURL);
    }

    photoURL = URL.createObjectURL(blob);

    photoPreview.src = photoURL;
    savePhoto.href = photoURL;

    previewSection.classList.remove("hidden");

  }, "image/jpeg", 0.92);
});

retake.addEventListener("click", function () {
  previewSection.classList.add("hidden");
});

window.addEventListener("pagehide", function () {

  if (stream) {
    stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

});
const openGallery = document.getElementById("openGallery");

openGallery.addEventListener("click", function () {
  const input = document.createElement("input");

  input.type = "file";
  input.accept = "image/*";

  input.click();

  input.addEventListener("change", function () {
    const file = input.files[0];

    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    photoPreview.src = imageURL;
    savePhoto.href = imageURL;

    previewSection.classList.remove("hidden");
  });
});
