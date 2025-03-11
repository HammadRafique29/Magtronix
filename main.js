const { app, BrowserWindow, screen, ipcMain, shell } = require('electron');
const notifier = require('electron-notifications-win');
const path = require('path');
const axios = require('axios');
const { globalAgent } = require('http');

let mainWindow;

MAIN_SERVER_URL = "http://localhost:8081"

templates_dir = path.join(__dirname, 'assests', 'templates');

globalThis.onClick = function(kwargs = {message : "No message"}) {
    console.log(kwargs.message);
}

globalThis.onClose = function(kwargs = {message : "No message"}) {
    console.log(kwargs.message);
}


app.whenReady().then(() => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: Math.max(1280, Math.floor(width * 0.8)),
        height: Math.max(720, Math.floor(height * 0.8)),
        frame: false,               // Removes default title bar
        transparent: true,          // Allows custom styling with transparency
        titleBarStyle: "hidden",    // For macOS-style hidden title bar   
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile(path.join(templates_dir, 'app.html'));

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http') && !url.startsWith('file://')) { 
            shell.openExternal(url);
            return { action: 'deny' };
        }
        const newWin = new BrowserWindow({
            width: 1000,
            height: 700,
            autoHideMenuBar: true, // Hides menu bar
            webPreferences: {
                nodeIntegration: false,
            },
        });
        newWin.loadURL(url);
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // Move notifier configuration and notification setup here
    notifier.config({
        spaceHeight: 20,
        icon: '/home/magician/Desktop/mouce/images/tts_feature.png',
        autoClose: true,
        duration: 5000,
    });
});

// Handle API call from renderer process
ipcMain.handle('fetch-data', async (event, url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
});

// Handle run-feature API call from renderer process
ipcMain.handle('run-feature', async (event, { feature_name, func_name, args }) => {
    try {
        const response = await axios.post('http://localhost:8081/run-feature', {
            feature_name,
            func_name,
            args
        });
        return response.data;
    } catch (error) {
        console.error('Error running feature:', error);
        throw error;
    }
});


ipcMain.on('notification.notify', (event, data) => {
    const notification = notifier.notify({
        title: data.title || 'Notification',
        body: data.body || 'No message provided',
        icon: data.icon || '',
        autoClose: data.autoClose || true,
    });
    if (data.onClick) {
        notification.on('click', () => {
            const func_call = globalThis[data.onClick];
            console.log('click', data.onClick, data.onClickArgs, typeof(func_call));
            if (typeof(func_call) === 'function') func_call(data.onClickArgs);            
        });
    }
    if (data.onClose) {
        notification.on('close', (id) => {
            const func_call = globalThis[data.onClose];
            console.log('Close', data.onClose, data.onCloseArgs, typeof(func_call), id);
            if (typeof(func_call) === 'function') func_call(data.onCloseArgs);
        });
    }
    notifier.beep();
});


ipcMain.on("navigate-to-page", (event, page) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.loadFile(path.join(templates_dir, page));
        win.once('ready-to-show', function (){
            win.show();
        });
    }
});


ipcMain.on("minimize-window", (event) => {
    console.log("Minimize Screen");
    if (mainWindow) mainWindow.minimize();
});


ipcMain.on("maximize-window", (event) => {
    console.log("Maximize Screen");
    if (mainWindow.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize();
    }
});


ipcMain.on("close-apps", (event, page) => {
    try{ fetch(`${MAIN_SERVER_URL}/close-main-app`, {method: "POST"}); } catch (error) {}
});


ipcMain.on("close-window", async (event) => {
    console.log("Close Screen");
    // try{ fetch(`${MAIN_SERVER_URL}/close-main-app`, {method: "POST"}); } catch (error) { console.log(error) }
    if (mainWindow) mainWindow.close();
});
