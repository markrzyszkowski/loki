const {app, BrowserWindow, dialog} = require('electron');
const {is, fixPathForAsarUnpack} = require('electron-util');
const config = require('./config');
const getPort = require('get-port');
const manifest = require('./manifest');
const tray = require('./tray');

app.setAppUserModelId('com.krzyszkowski.loki');

let mainWindow;
let agentProcess;
let agentPort;
let isQuitting = false;

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

async function startAgentProcess() {
    agentPort = await getPort();

    const path = fixPathForAsarUnpack(`${app.getAppPath()}/build`);
    console.log(agentPort);

    agentProcess = require('child_process')
        .spawn('java', ['-jar', `-Dserver.port=${agentPort}`, manifest.agent], {
            cwd: path
        });

    if (!agentProcess) {
        dialog.showErrorBox('Startup error', `Could not start agent process from ${path}`);
        app.quit();
        return;
    }

    agentProcess.stdout.on('data', (data) => {
        console.log(data.toString());
    });
}

function createMainWindow() {
    const lastWindowState = config.get('lastWindowState');

    const mainUrl = `http://localhost:${agentPort}/index.html`;

    const window = new BrowserWindow({
        title: 'Loki',
        x: lastWindowState.x,
        y: lastWindowState.y,
        width: lastWindowState.width,
        height: lastWindowState.height,
        minWidth: 1280,
        minHeight: 720,
        show: false
    });

    window.loadURL(mainUrl);

    window.on('resize', () => {
        config.set('lastWindowState', window.getNormalBounds());
    });

    window.on('close', (event) => {
        if (config.get('quitOnWindowClose')) {
            if (agentProcess) {
                const kill = require('tree-kill');
                kill(agentProcess.pid, 'SIGTERM', () => {
                    app.quit();
                });
            }
            return;
        }

        if (!isQuitting) {
            event.preventDefault();

            window.blur();
            if (is.macos) {
                app.hide();
            } else {
                window.hide();
            }
        }
    });

    return window;
}

(async () => {
    await app.whenReady();

    await startAgentProcess();

    mainWindow = createMainWindow();

    tray.create(mainWindow);

    const {webContents} = mainWindow;

    webContents.on('dom-ready', () => {
        mainWindow.show();
    });
})();

app.on('activate', () => {
    if (mainWindow) {
        mainWindow.show();
    }
});

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.show();
    }
});

app.on('before-quit', () => {
    isQuitting = true;

    if (mainWindow) {
        config.set('lastWindowState', mainWindow.getNormalBounds());
    }
});
