import { app, BrowserWindow, ipcMain } from "electron";
// import * as child from "child_process";
import * as path from "path";
import * as url from "url";

import { Team } from "./src/app/models/team";
import { TimerStatus } from "./src/app/models/timer-status";
import { StreamingInfo } from "./src/app/models/streaming-info";

let win: BrowserWindow = null;
let graphics: BrowserWindow = null;
let recorder: BrowserWindow = null;
// let ffmpeg: child.ChildProcess;

const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

// const YT_URL = "rtmp://a.rtmp.youtube.com/live2";

function createWindow(): BrowserWindow {
  // const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 850,
    height: 685,
    resizable: false,
    maximizable: false,
    autoHideMenuBar: true,
    title: "MatchFx",

    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  graphics = new BrowserWindow({
    width: 640,
    height: 480,
    useContentSize: true,
    title: "Preview",
    autoHideMenuBar: true,
    closable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  recorder = new BrowserWindow({
    // autoHideMenuBar: true,
    closable: false,
    // opacity:0,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    resizable: false,
    skipTaskbar: true,
    show: false,
    title: "Recorder",
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run 2e2 test with Spectron
      enableRemoteModule: true, // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {
    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    win.loadURL("http://localhost:4200/#/home");
    graphics.loadURL("http://localhost:4200/#/graphics");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true,
        hash: "/home",
      })
    );
    graphics.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        hash: "/graphics",
      })
    );
    recorder.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        hash: "/recorder",
      })
    );
  }

  //IPC events
  ipcMain.on("home", (event, arg: Team) => {
    graphics.webContents.send("home", arg);
  });

  ipcMain.on("away", (event, arg: Team) => {
    graphics.webContents.send("away", arg);
  });

  ipcMain.on("visible", (event, arg: boolean) => {
    graphics.webContents.send("visible", arg);
  });

  ipcMain.on("time", (event, arg: TimerStatus) => {
    graphics.webContents.send("time", arg);
  });

  ipcMain.on("period", (event, arg: string) => {
    graphics.webContents.send("period", arg);
  });

  ipcMain.on("start-stream", (event, arg: StreamingInfo) => {
    recorder.webContents.send("start-stream", arg);
  });

  ipcMain.on("stop-stream", () => {
    recorder.webContents.send("stop-stream");
  });

  ipcMain.on("set-video-source", (event, arg)=>{
    graphics.webContents.send("set-video-source", arg);
  });

  ipcMain.on("set-audio-source", (event, arg)=>{
    recorder.webContents.send("set-audio-source", arg);
  });

  ipcMain.on("set-preview-size" ,(event, arg)=>{
    graphics.setMinimumSize(arg.width, arg.height);
    graphics.setSize(arg.width, arg.height);
  });

  win.on("show", () => {
    setTimeout(() => {
      win.focus();
    }, 200);
  });

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
    graphics = null;
    recorder = null;
    app.exit();
  });

  recorder.once('close', ()=>{
    recorder.webContents.send('recorder-destroy');
  });

  return win;
}

try {
  app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on("ready", () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
