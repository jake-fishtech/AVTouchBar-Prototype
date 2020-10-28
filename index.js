const fs = require("fs");
const {
  app,
  BrowserWindow,
  TouchBar,
  ipcMain,
  nativeImage,
} = require("electron");

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile("./src/index.html");
  mainWindow.setPosition(0, 0);
  // setTimeout(() => {
  spin.backgroundColor = "#000";
  //   // spin.icon = "./touchimage.png"
  //   let newImage = nativeImage
  //     .createFromPath("./test.jpg")
  //     .resize({ width: 659, height: 30 });
  //   // newImage.image.resize({width: 659, height: 30})
  // }, 1000);
});
ipcMain.on("url:send", (e, data) => {
  var imageBuffer = new Buffer(data, "base64"); //console = <Buffer 75 ab 5a 8a ...
  fs.writeFile("test2.jpg", imageBuffer, function (err) {
    if (err) console.log("err");
    let newImage = nativeImage
      .createFromPath("./test2.jpg")
      .resize({ width: 659, height: 30 });
    // console.log("this is new", newImage.getSize());
    spin.icon = newImage;

  });
  // let icon = nativeImage.createFromDataURL(data)
  // let newImage = nativeImage.createFromPath("./touchimage.png")

  // console.log(newImage.getSize())
  // spin.icon = newImage
  //  spin.backgroundColor = "red"
  // spin.icon = icon
  // console.log(newTouchbar)
  // window.setTouchBar(newTouchbar)

  spin.icon = "/test.png";

  // let spin = new TouchBarButton({
  //   label: '🎰 Spin',
  // backgroundColor: '#7851A9'
  // })
});
let spinning = false;

// Reel labels
const reel1 = new TouchBarLabel();
const reel2 = new TouchBarLabel();
const reel3 = new TouchBarLabel();

// Spin result label
const result = new TouchBarLabel();

const createNewFrame = (icon) => {
  let newSpin = new TouchBarButton({
    icon: icon,
  });

  return newSpin;
};
// Spin button
let spin = new TouchBarButton({
  // icon: "./touchimage.png",
  //   label: '🎰 Spin',
  backgroundColor: "#7851A9",
  click: () => {
    // Ignore clicks if already spinning
    if (spinning) {
      return;
    }

    spinning = true;
    result.label = "";

    let timeout = 10;
    const spinLength = 4 * 1000; // 4 seconds
    const startTime = Date.now();

    const spinReels = () => {
      updateReels();

      if (Date.now() - startTime >= spinLength) {
        finishSpin();
      } else {
        // Slow down a bit on each spin
        timeout *= 1.1;
        setTimeout(spinReels, timeout);
      }
    };

    spinReels();
  },
});

const getRandomValue = () => {
  const values = ["🍒", "💎", "7️⃣", "🍊", "🔔", "⭐", "🍇", "🍀"];
  return values[Math.floor(Math.random() * values.length)];
};

const updateReels = () => {
  reel1.label = getRandomValue();
  reel2.label = getRandomValue();
  reel3.label = getRandomValue();
};

const finishSpin = () => {
  const uniqueValues = new Set([reel1.label, reel2.label, reel3.label]).size;
  if (uniqueValues === 1) {
    // All 3 values are the same
    result.label = "💰 Jackpot!";
    result.textColor = "#FDFF00";
  } else if (uniqueValues === 2) {
    // 2 values are the same
    result.label = "😍 Winner!";
    result.textColor = "#FDFF00";
  } else {
    // No values are the same
    result.label = "🙁 Spin Again";
    result.textColor = null;
  }
  spinning = false;
};

let touchBar = new TouchBar({
  items: [
    spin,
    new TouchBarSpacer({ size: "large" }),
    reel1,
    new TouchBarSpacer({ size: "small" }),
    reel2,
    new TouchBarSpacer({ size: "small" }),
    reel3,
    new TouchBarSpacer({ size: "large" }),
    result,
  ],
});

let window;
const createNewTouchbar = (spin) => {
  let newTouchBar = new TouchBar({
    items: [spin],
  });
  return newTouchBar;
};
app.whenReady().then(() => {
  window = new BrowserWindow({
    // frame: false,
    // titleBarStyle: "hiddenInset",
    width: 200,
    height: 200,
    backgroundColor: "#000",
  });
  window.loadURL("about:blank");
  window.setTouchBar(touchBar);
});
