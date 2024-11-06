const uploadBox = document.querySelector(".upload-box"),
  previewImg = uploadBox.querySelector("img"),
  fileInput = uploadBox.querySelector("input"),
  widthInput = document.querySelector(".width input"),
  heightInput = document.querySelector(".height input"),
  ratioInput = document.querySelector(".ratio input"),
  qualityInput = document.querySelector(".quality input"),
  downloadBtn = document.querySelector(".download-btn"),
  formatSelect = document.getElementById("format"),
  filenameInput = document.getElementById("filename"),
  originalFileSizeText = document.getElementById("originalFileSize"),
  fileSizeText = document.getElementById("fileSize");

let ogImageRatio, originalFileSize;

const loadFile = (e) => {
  const file = e.target.files[0]; // Get first selected file
  if (!file) return; // Return if no file selected

  previewImg.src = URL.createObjectURL(file); // Set preview image
  previewImg.addEventListener("load", () => {
    // Once image loads
    widthInput.value = previewImg.naturalWidth;
    heightInput.value = previewImg.naturalHeight;
    ogImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;

    // Display file size and activate the content section
    originalFileSize = Math.round(file.size / 1024); // Size in KB
    originalFileSizeText.innerText = `Original Size: ${originalFileSize} KB`;
    document.querySelector(".wrapper").classList.add("active");
  });
};

widthInput.addEventListener("keyup", () => {
  // Lock aspect ratio and adjust height based on width
  const height = ratioInput.checked ? widthInput.value / ogImageRatio : heightInput.value;
  heightInput.value = Math.floor(height);
});

heightInput.addEventListener("keyup", () => {
  // Lock aspect ratio and adjust width based on height
  const width = ratioInput.checked ? heightInput.value * ogImageRatio : widthInput.value;
  widthInput.value = Math.floor(width);
});

const resizeAndDownload = () => {
  const canvas = document.createElement("canvas");
  const a = document.createElement("a");
  const ctx = canvas.getContext("2d");
  
  // Set image quality based on the checkbox value
  // if quality checkbox is checked, pass 0.5 to imgQuality else pass 1.0
  // 1.0 is 100% quality where 0.5 is 50% of total. you can pass from 0.1 - 1.0
  const format = formatSelect.value || "image/jpeg";
  const imgQuality = qualityInput.checked ? 0.5 : 1.0;

  // Set canvas dimensions based on input
  canvas.width = widthInput.value;
  canvas.height = heightInput.value;

  // Draw image onto canvas
  ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);

  // Get the image data URL with selected format and quality
  a.href = canvas.toDataURL(format, imgQuality);
  const filename = filenameInput.value.trim() || "resized_image";
  a.download = `${filename}.${format.split("/")[1]}`; // Set file extension
  a.click(); // Trigger download
};

const showCompressedFileSize = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const format = formatSelect.value || "image/jpeg";
  const imgQuality = qualityInput.checked ? 0.5 : 1.0;

  canvas.width = widthInput.value;
  canvas.height = heightInput.value;
  ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);

  // Estimate file size by checking the data URL length
  const dataUrl = canvas.toDataURL(format, imgQuality);
  const fileSize = Math.round((dataUrl.length * (3 / 4)) / 1024); // Convert to KB
  fileSizeText.innerText = `Compressed Size: ${fileSize} KB`;
};

downloadBtn.addEventListener("click", () => {
  resizeAndDownload();
  showCompressedFileSize();
});

fileInput.addEventListener("change", loadFile);
uploadBox.addEventListener("click", () => fileInput.click());

// Drag and Drop Events
uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.classList.add("dragover");
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.classList.remove("dragover");
});

uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBox.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files; // Assign file to input
    loadFile({ target: { files: [file] } });
  }
});


// Add event listener to handle Enter key press for download
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        // Trigger the download when Enter key is pressed
        resizeAndDownload();
        showCompressedFileSize(); // Show compressed file size after download
    }
});