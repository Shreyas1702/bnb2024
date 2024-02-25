const recordBtn = document.querySelector(".mic-icon");

let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

function populateLanguages() {
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

var result;

function speechToText() {
  try {
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recordBtn.classList.add("recording");
    recognition.start();
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      //detect when intrim results
      // console.log(speechResult);
      if (event.results[0].isFinal) {
        // result.innerHTML += " " + speechResult;
        // result.querySelector("p").remove();
        // console.log(speechResult);
        result = speechResult;
      } else {
        //creative p with class interim if not already there
        //update the interim p with the speech result
      }
    };
    recognition.onspeechend = () => {
      speechToText();
    };
    recognition.onerror = (event) => {
      stopRecording();
      if (event.error === "no-speech") {
        alert("No speech was detected. Stopping...");
      } else if (event.error === "audio-capture") {
        alert(
          "No microphone was found. Ensure that a microphone is installed."
        );
      } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
      } else if (event.error === "aborted") {
        alert("Listening Stopped.");
      } else {
        alert("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    recording = false;

    console.log(error);
  }
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    console.log("recording");
    speechToText();
    recording = true;
  } else {
    console.log("Non-recording");
    stopRecording();
  }
});

async function stopRecording() {
  recognition.stop();
  console.log(result);
  result = undefined;
  //   const resp = await axios.post("http://127.0.0.1:5000/bot", {
  //     inpt: result,
  //   });

  //   console.log(resp);
  //   var link = "http://127.0.0.1:3000" + resp.data.Endpoint;
  //   console.log(link);
  //   window.location.href = link;
  recording = false;
}

// function download() {
//   const text = result.innerText;
//   const filename = "speech.txt";

//   const element = document.createElement("a");
//   element.setAttribute(
//     "href",
//     "data:text/plain;charset=utf-8," + encodeURIComponent(text)
//   );
//   element.setAttribute("download", filename);
//   element.style.display = "none";
//   document.body.appendChild(element);
//   element.click();
//   document.body.removeChild(element);
// }

// downloadBtn.addEventListener("click", download);

// clearBtn.addEventListener("click", () => {
//   result.innerHTML = "";
//   downloadBtn.disabled = true;
// });
