const {dialog, ipcMain: ipc} = require('electron');
const log = require('electron-log');

function setupIpc(webContents, properties) {
    const {agentPort} = properties;

    const importFilters = {
        openapi: [
            {
                name: 'OpenAPI 2.0/3.0 Spec',
                extensions: [
                    'json', 'yaml'
                ]
            }
        ],
        har: [
            {
                name: 'HAR file',
                extensions: [
                    'har'
                ]
            }
        ]
    };

    const exportFilters = {
        openapi: [
            {
                name: 'OpenAPI 3.0 Spec (JSON)',
                extensions: [
                    'json'
                ]
            },
            {
                name: 'OpenAPI 3.0 Spec (YAML)',
                extensions: [
                    'yaml'
                ]
            }
        ]
    };

    ipc.on('agent-port', () => {
        log.debug(`Sending agent port to renderer process: ${agentPort}`);
        webContents.send('agent-port', agentPort);
    });

    ipc.on('open-project', () => {
        log.debug('Open project action received; showing dialog...');
        const paths = dialog.showOpenDialogSync({
            title: 'Select project',
            buttonLabel: 'Open',
            properties: [
                'openFile'
            ],
            filters: [
                {
                    name: 'Loki file',
                    extensions: [
                        'lki'
                    ]
                }
            ]
        });

        log.info(`Dialog for open project action yielded path: ${paths}`);
        webContents.send('open-project', paths ? paths[0] : null);
    });

    ipc.on('import-project', (_, type) => {
        log.debug(`Import project action received for type: ${type}; showing dialog...`);
        const paths = dialog.showOpenDialogSync({
            title: 'Select file to import',
            buttonLabel: 'Import',
            properties: [
                'openFile'
            ],
            filters: importFilters[type]
        });

        log.info(`Dialog for import project action yielded path: ${paths}`);
        webContents.send('import-project', paths ? paths[0] : null);
    });

    ipc.on('export-project', (_, type) => {
        log.debug(`Export project action received for type: ${type}; showing dialog...`);
        const path = dialog.showSaveDialogSync({
            title: 'Export project',
            buttonLabel: 'Export',
            filters: exportFilters[type]
        });

        log.info(`Dialog for export project action yielded path: ${path}`);
        webContents.send('export-project', path ? path : null);
    });

    ipc.on('save-project', () => {
        log.debug('Save project action received; showing dialog...');
        let path = dialog.showSaveDialogSync({
            title: 'Save project',
            buttonLabel: 'Save',
            filters: [
                {
                    name: 'Loki file',
                    extensions: [
                        'lki'
                    ]
                }
            ]
        });

        if (path.split('.').pop() !== 'lki') {
            path += '.lki';
        }

        log.info(`Dialog for save project action yielded path: ${path}`);
        webContents.send('save-project', path ? path : null);
    });
}

module.exports = {
    setup: setupIpc
};
