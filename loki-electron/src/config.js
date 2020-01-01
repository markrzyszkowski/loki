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
            }
        },
        default: {
            x: undefined,
            y: undefined,
            width: 1280,
            height: 720
        }
    },
    quitOnWindowClose: {
        type: 'boolean',
        default: false
    }
};

const store = new Store({schema});

module.exports = store;
