const {app, BrowserWindow, Menu, Tray} = require('electron');

let tray;
let contextMenu;

function create(window) {
    if (tray) {
        return;
    }

    function toggleWindow() {
        if (window.isVisible()) {
            window.hide();
        } else {
            window.show();
        }
    }

    contextMenu = Menu.buildFromTemplate([
        {
            label: 'Toggle visibility',
            click() {
                toggleWindow();
            }
        },
        {
            role: 'quit'
        }
    ]);

    tray = new Tray(app.getAppPath() + '/static/icon_tray.png');

    tray.setContextMenu(contextMenu);

    tray.on('click', toggleWindow);
    tray.on('right-click', () => {
        tray.popUpContextMenu();
    });
}

module.exports = {
    create: create
};
