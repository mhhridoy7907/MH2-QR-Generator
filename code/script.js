const input = document.getElementById("urlInput");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const canvas = document.getElementById("qrCanvas");
const emptyState = document.getElementById("emptyState");
const downloads = document.getElementById("downloads");
const downloadJpg = document.getElementById("downloadJpg");
const downloadPng = document.getElementById("downloadPng");
const urlPreview = document.getElementById("urlPreview");
const status = document.getElementById("status");

let currentUrl = "";

function updateClearButton() {
  clearBtn.style.display = input.value.trim() ? "block" : "none";
}

function makeQR() {
  let url = input.value.trim();

  if (!url) {
    status.textContent = "Please enter a URL.";
    input.focus();
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  currentUrl = url;

  const temp = document.createElement("div");

  new QRCode(temp, {
    text: url,
    width: 800,
    height: 800,
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {

    const generatedCanvas = temp.querySelector("canvas");
    const generatedImg = temp.querySelector("img");

    const source = generatedCanvas || generatedImg;

    if (!source) {
      status.textContent = "QR generation failed. Please try again.";
      return;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 800;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 800);

    if (generatedCanvas) {
      ctx.drawImage(generatedCanvas, 0, 0, 800, 800);
      showQR();
    } else {
      const img = new Image();

      img.onload = function() {
        ctx.drawImage(img, 0, 0, 800, 800);
        showQR();
      };

      img.src = source.src;
    }

  }, 100);

  function showQR() {
    canvas.style.display = "block";
    emptyState.style.display = "none";
    downloads.style.display = "flex";

    urlPreview.textContent = currentUrl;
    urlPreview.style.display = "block";

    status.textContent = "QR Code generated successfully.";
  }
}

function downloadFile(extension, mimeType) {

  if (!currentUrl || canvas.style.display === "none") {
    status.textContent = "Generate a QR Code first.";
    return;
  }

  const output = document.createElement("canvas");
  output.width = 1200;
  output.height = 1200;

  const ctx = output.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1200, 1200);

  ctx.drawImage(canvas, 0, 0, 1200, 1200);

  const link = document.createElement("a");

  link.download = "MH2-QR-Code." + extension;
  link.href = output.toDataURL(mimeType, 0.95);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  status.textContent = extension.toUpperCase() + " downloaded.";
}

generateBtn.addEventListener("click", makeQR);

input.addEventListener("input", updateClearButton);

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    makeQR();
  }
});

clearBtn.addEventListener("click", function() {
  input.value = "";
  currentUrl = "";

  canvas.style.display = "none";
  emptyState.style.display = "block";
  downloads.style.display = "none";
  urlPreview.style.display = "none";
  status.textContent = "";

  updateClearButton();
  input.focus();
});

document.querySelectorAll(".example-btn").forEach(button => {
  button.addEventListener("click", function() {
    input.value = this.dataset.url;
    updateClearButton();
    makeQR();
  });
});

downloadJpg.addEventListener("click", function() {
  downloadFile("jpg", "image/jpeg");
});

downloadPng.addEventListener("click", function() {
  downloadFile("png", "image/png");
});

updateClearButton();

window.addEventListener("load", function() {
  makeQR();
});