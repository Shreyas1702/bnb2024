console.log("Hello Daddy");
var fileLists = document.getElementById("image");

function openCModal() {
  document.getElementById("myModal").style.display = "block";
}

function dropHandler(event) {
  event.preventDefault();

  fileList = event.dataTransfer.files;

  var output = document.getElementById("fileList");
  output.innerHTML = "";

  for (var i = 0; i < fileList.length; i++) {
    var file = fileList[i];
    output.innerHTML += "<p>" + file.name + " - " + file.size + " bytes</p>";
  }
}

// async function uploadFiles(ev) {
//   try {
//     console.log("Hello");
//     console.log(fileLists.files[0]);
//     const formData = new FormData();
//     formData.append("file", fileLists.files[0]);
//     const response = await axios({
//       method: "post",
//       url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//       data: formData,
//       headers: {
//         pinata_api_key: `403a4001d5cc63b3ce0f`,
//         pinata_secret_api_key: `cd44bc63c6fdbabc149ce19412cc7c049d2ee4e5477ce8e9f824ef323a8a0c30`,
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//     console.log(ImgHash);

//     let res = await fetch(`http://localhost:3000/uploadData`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         ImgHash,
//       }),
//     });
//     console.log(res);
//     if (res.status == 200) {
//       alert("File Successfully Uploaded");
//       modal.style.display = "none";
//     }
//   } catch (error) {
//     console.log(error);
//     console.log("Unable to Upload the Image");
//   }
// }

function dragOverHandler(event) {
  event.preventDefault();
}

// Get the modal
var modal = document.getElementById("myModal");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  console.log("Closed");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

var fileLists = document.getElementById("image");

function openCModals() {
  document.getElementById("myModals").style.display = "block";
}

function dropHandler(event) {
  event.preventDefault();

  fileList = event.dataTransfer.files;

  var output = document.getElementById("fileList");
  output.innerHTML = "";

  for (var i = 0; i < fileList.length; i++) {
    var file = fileList[i];
    output.innerHTML += "<p>" + file.name + " - " + file.size + " bytes</p>";
  }
}

// async function uploadFiles(ev) {
//   try {
//     console.log("Hello");
//     console.log(fileLists.files[0]);
//     const formData = new FormData();
//     formData.append("file", fileLists.files[0]);
//     const response = await axios({
//       method: "post",
//       url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//       data: formData,
//       headers: {
//         pinata_api_key: `403a4001d5cc63b3ce0f`,
//         pinata_secret_api_key: `cd44bc63c6fdbabc149ce19412cc7c049d2ee4e5477ce8e9f824ef323a8a0c30`,
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//     console.log(ImgHash);

//     let res = await fetch(`http://localhost:3000/uploadData`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         ImgHash,
//       }),
//     });
//     console.log(res);
//     if (res.status == 200) {
//       alert("File Successfully Uploaded");
//       modal.style.display = "none";
//     }
//   } catch (error) {
//     console.log(error);
//     console.log("Unable to Upload the Image");
//   }
// }

function closeModals() {
  document.getElementById("myModal").style.display = "none";
}

// Get the modal
var modals = document.getElementById("myModals");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modals.style.display = "none";
  }
};
