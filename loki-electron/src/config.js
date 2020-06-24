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
            width: 1366,
            height: 768,
            isMaximized: true
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
