const {app, Menu, Tray} = require('electron');
const log = require('electron-log');
const {is} = require('electron-util');
const path = require('path');
const config = require('./config');

let tray;

function createTray(window) {
    if (tray) {
        return;
    }

    const toggleWindow = () => {
        if (window.isVisible()) {
            window.hide();
        } else {
            if (config.get('lastWindowState').isMaximized) {
                window.maximize();
                window.focus();
            } else {
                window.show();
            }
        }
    };

    const updateConfig = () => {
        const current = config.get('quitOnWindowClose');
        config.set('quitOnWindowClose', !current);
        log.debug(`Setting quitOnWindowClose changed from ${current} to ${!current}`);
    };

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Toggle visibility',
            visible: !is.macos,
            click() {
                toggleWindow();
            }
        },
        {
            label: 'Settings',
            submenu: [
                {
                    label: 'Quit on window close',
                    type: 'checkbox',
                    checked: config.get('quitOnWindowClose'),
                    click() {
                        updateConfig();
                    }
                }
            ]
        },
        {
            role: 'quit'
        }
    ]);

    tray = new Tray(path.join(app.getAppPath(), 'static', 'icon_tray.png'));

    tray.setContextMenu(contextMenu);

    tray.on('click', toggleWindow);
    tray.on('right-click', () => {
        tray.popUpContextMenu();
    });
}

module.exports = {
    create: createTray
};
