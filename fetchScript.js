const electron = require("electron")
const {ipcRenderer, desktopCapturer} = electron
var canvas = document.getElementById("cnv1");
var shots  = [];
var grabLimit = 30;  // Number of screenshots to take
var grabRate  = 1000; // Miliseconds. 500 = half a second

var count     = 0;
const startFetch = () =>{
setInterval(()=>{
    let image = canvas.toDataURL("image/jpg")
    let strippedImage = image.replace(/^data:image\/png;base64,/, "")
    ipcRenderer.send("url:send", strippedImage)
    // console.log(image.replace("data:image/png;base64,", ""))
},25)
}
// const getUserMedia = async ( ) => {

//     const userMedia = await navigator.mediaDevices.getUserMedia() 
//     console.log(userMedia)
// }
const constraints = {
    audio: {
      mandatory: {
        chromeMediaSource: 'desktop'
      }
    },
    video: {
      mandatory: {
        chromeMediaSource: 'desktop'
      }
    }
  }
const getUserMedia = async () =>{
    const devices = await navigator.mediaDevices.enumerateDevices()
        let audDevice = devices.filter(device => {
            return device.kind == "audiooutput" && device.label == "Soundflower (2ch)" && device.deviceId != "default"
        })[0];
 
 
        //We get the user media corresponding to the audio device we are willing to get
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId:{exact: audDevice.deviceId}
            }
        })

        const audioTrack = mediaStream.getAudioTracks()

        // console.log(window.URL.createObjectURL(audioStream))
        // handleStream(audioStream)
        console.log(audioTrack)

}

const getSource = () =>{

}
function handleStream (stream) {
    // const video = document.querySelector('video')
    // console.log(stream.getAudioTracks())
    // video.srcObject = stream
    // video.onloadedmetadata = (e) => video.play()
  }
  
  function handleError (e) {
    console.log(e)
  }

module.exports = {startFetch, getUserMedia}