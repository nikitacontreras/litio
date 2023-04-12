const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
console.log(`${path.join(__dirname, "../preload.js")}`)

app.disableHardwareAcceleration()

let win = null

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f3241',
            symbolColor: '#74b1be',
        },
        webPreferences: {
            devTools:true,
            nodeIntegration: true,
            //contextIsolation: false,
            enableRemoteModule: true,
            preload: `${path.join(__dirname, "../preload.js")}`,
        },
    })
    win.setMenu(null)
    const winURL = isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`

    win.loadURL(winURL)

    win.on('ready-to-show', async () => {
        win.show()
        win.maximize()
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') {
        app.quit()
    }
})