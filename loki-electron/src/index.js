const {app, BrowserWindow, dialog, screen} = require('electron');
const log = require('electron-log');
const {fixPathForAsarUnpack, is} = require('electron-util');
const cp = require('child_process');
const express = require('express');
const getPort = require('get-port');
const config = require('./config');
const ipc = require('./ipc');
const tray = require('./tray');

app.setAppUserModelId('com.krzyszkowski.loki');

app.allowRendererProcessReuse = true;

if (!is.development) {
    if (config.get('debug')) {
        log.transports.file.level = 'debug';
    } else {
        log.transports.file.level = 'info';
    }
}

let mainWindow;
let webContents;
let agentPort;
let agentProcess;
let callbackPort;
let callbackServer;
let isQuitting = false;

if (!app.requestSingleInstanceLock()) {
    app.quit();
}

(() => {
    log.info(`Starting Loki application with PID ${process.pid}`);
    log.info('Checking if Java is present on the machine');

    const javaCheck = cp.spawnSync('java', ['-version']);

    if (javaCheck.error) {
        log.error('Java is not installed or not in PATH');
        dialog.showErrorBox('Startup error', 'Java is not installed or not present in PATH');
        app.exit();
        return;
    }
    log.info('Java is present; verifying Java version');

    const versionOutput = javaCheck.stderr.toString();
    log.debug(`Java version check output:\n${versionOutput}`);

    const versionString = javaCheck.stderr.toString().match(/\w+\s\w+\s"(\d+).*"/);

    if (versionString) {
        log.debug(`Java version found: ${versionString[1]}`);

        if (parseInt(versionString[1]) < 11) {
            log.error('Installed Java version must be 11 or above');
            dialog.showErrorBox('Startup error', 'Installed Java version must be 11 or above');
            app.exit();
            return;
        }
    } else {
        log.error('Could not determine Java version');
        dialog.showErrorBox('Startup error', 'Could not determine Java version');
        app.exit();
        return;
    }

    log.info('Java version matches requirements; >= 11');
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

    if (agentProcess) {
        log.info('Stopping agent process');
        require('tree-kill')(agentProcess.pid, 'SIGTERM');
    }

    if (mainWindow) {
        const {isMaximized} = config.get('lastWindowState');
        config.set('lastWindowState', {...mainWindow.getNormalBounds(), isMaximized});
    }

    log.info('Stopping Loki application');
});

app.on('ready', () => {
    screen.on('display-removed', () => {
        const [x, y] = mainWindow.getPosition();
        mainWindow.setPosition(x, y);
    });
});

async function setupAgentCallback() {
    log.info('Preparing callback server for agent process');

    const xp = express();

    xp.get('/ready', async (_, response) => {
        log.info('Received ready message from agent process');

        mainWindow.loadURL(`http://localhost:${agentPort}/index.html`).then(() => {
            log.debug('Application URL fully loaded; showing main window');

            if (config.get('lastWindowState.isMaximized')) {
                mainWindow.maximize();
            } else {
                mainWindow.show();
            }
        });

        response.send();
        callbackServer.close(() => {
            log.debug('Callback server closed');
        });
    });

    callbackPort = await getPort();
    callbackServer = xp.listen(callbackPort, () => {
        log.debug(`Callback server started on port ${callbackPort}`);
    });
}

async function setupAgent() {
    agentPort = await getPort();

    const path = require('path').join(fixPathForAsarUnpack(app.getAppPath()), 'build');

    let agentJar;
    let mockJar;

    try {
        const files = require('fs').readdirSync(path);

        files.forEach(file => {
            if (file.includes('loki-agent')) {
                agentJar = file;
            }
            if (file.includes('loki-mock')) {
                mockJar = file;
            }
        });
    } catch (error) {
        log.error(`Could not read executables directory: ${path}`);
        dialog.showErrorBox('Startup error', `Could not read executables directory: ${path}`);
        app.quit();
        return;
    }

    if (agentJar && mockJar) {
        log.info(`Found required executables: ${agentJar}, ${mockJar}`);
    } else {
        log.error(`Could not find required executables at ${path}`);
        log.error(`Missing jars: agent = ${!agentJar} | mock = ${!mockJar}`);
        dialog.showErrorBox('Startup error', `Could not find required executables at ${path}`);
        app.quit();
        return;
    }

    const args = [
        `-Dserver.port=${agentPort}`,
        `-Dloki.agent.mock.jar=${mockJar}`,
        `-Dloki.agent.electron.port=${callbackPort}`,
        '-jar',
        agentJar
    ];
    const options = {cwd: path};

    log.info('Starting agent process');
    log.debug(`Arguments: [${args.join(', ')}]`);

    agentProcess = cp.spawn('java', args, options);

    agentProcess.on('exit', (code, signal) => {
        if (!isQuitting) {
            log.error(`Agent process has stopped; exit code: ${code} | signal: ${signal}`);
            dialog.showErrorBox('Internal error', 'Agent process has stopped');
            app.quit();
            return;
        }
        log.info('Agent process exited succesfully');
    });

    if (is.development) {
        agentProcess.stdout.on('data', data => {
            log.silly(data.toString());
        });
    }
}

function createMainWindow() {
    log.info('Preparing application window');

    const lastWindowState = config.get('lastWindowState');

    const window = new BrowserWindow({
        title: 'Loki',
        x: lastWindowState.x,
        y: lastWindowState.y,
        width: lastWindowState.width,
        height: lastWindowState.height,
        minWidth: 1280,
        minHeight: 720,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    log.info('Application window created');
    log.debug(`Window position: {x = ${lastWindowState.x}; y = ${lastWindowState.y}}`);
    log.debug(`Window dimensions: ${lastWindowState.width}x${lastWindowState.height}`);

    if (!is.development) {
        window.removeMenu();
    }

    window.on('resize', () => {
        const {isMaximized} = config.get('lastWindowState');
        config.set('lastWindowState', {...window.getNormalBounds(), isMaximized});
    });

    window.on('maximize', () => {
        config.set('lastWindowState.isMaximized', true);
    });

    window.on('unmaximize', () => {
        config.set('lastWindowState.isMaximized', false);
    });

    window.on('close', (event) => {
        if (!isQuitting) {
            if (config.get('quitOnWindowClose')) {
                app.quit();
                return;
            }

            event.preventDefault();

            window.blur();
            if (!is.macos) {
                window.hide();
            } else {
                app.hide();
            }
        }
    });

    mainWindow = window;
    webContents = mainWindow.webContents;
}

function createTray() {
    tray.create(mainWindow);
}

function setupIpc() {
    ipc.setup(webContents, {agentPort: agentPort});
}

(async () => {
    await Promise.all([app.whenReady(), setupAgentCallback()]);

    createMainWindow();
    createTray();

    await setupAgent();

    setupIpc();
})();
