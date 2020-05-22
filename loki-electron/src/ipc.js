const {dialog, ipcMain: ipc} = require('electron');
const log = require('electron-log');

function setupIpc(webContents, properties) {
    const {agentPort} = properties;

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

    ipc.on('import-project', () => {
        log.debug('Import project action received; showing dialog...');
        const paths = dialog.showOpenDialogSync({
            title: 'Select file to import',
            buttonLabel: 'Import',
            properties: [
                'openFile'
            ],
            filters: [
                {
                    name: 'Supported files',
                    extensions: [
                        'har'
                    ]
                }
            ]
        });

        log.info(`Dialog for import project action yielded path: ${paths}`);
        webContents.send('import-project', paths ? paths[0] : null);
    });

    ipc.on('export-project', () => {
        log.debug('Export project action received; showing dialog...');
        const path = dialog.showSaveDialogSync({
            title: 'Export project',
            buttonLabel: 'Export',
            filters: [
                {
                    name: 'HAR file',
                    extensions: [
                        'har'
                    ]
                }
            ]
        });

        log.info(`Dialog for export project action yielded path: ${path}`);
        webContents.send('export-project', path ? path : null);
    });

    ipc.on('save-project', () => {
        log.debug('Save project action received; showing dialog...');
        const path = dialog.showSaveDialogSync({
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

        log.info(`Dialog for save project action yielded path: ${path}`);
        webContents.send('save-project', path ? path : null);
    });
}

module.exports = {
    setup: setupIpc
};
