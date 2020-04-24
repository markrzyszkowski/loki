const Store = require('electron-store');

const schema = {
    lastWindowState: {
        type: 'object',
        properties: {
            x: {
                type: 'number'
            },
            y: {
                type: 'number'
            },
            width: {
                type: 'number'
            },
            height: {
                type: 'number'
            },
            isMaximized: {
                type: 'boolean'
            }
        },
        default: {
            x: undefined,
            y: undefined,
            width: 1280,
            height: 720,
            isMaximized: false
        }
    },
    quitOnWindowClose: {
        type: 'boolean',
        default: false
    },
    debug: {
        type: 'boolean',
        default: false
    }
};

const store = new Store({schema});

module.exports = store;
