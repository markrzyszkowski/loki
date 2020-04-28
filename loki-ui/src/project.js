import axios from 'axios';
import { v4 as uuid } from 'uuid';
import ipc from './ipc';

let agentPort;

ipc.once('agent-port', (event, port) => {
    agentPort = port;
});

ipc.send('agent-port');

const newTab = () => {
    return {
        name: 'Untitled mock',
        url: '',
        rules: []
    };
};

const newProject = () => {
    return {
        id: uuid(),
        name: 'Untitled project',
        tabs: [
            newTab()
        ],
        warnings: [],
    };
};

const openProject = path => {
    return axios.post(`http://localhost:${agentPort}/api/project/open`, {
        path: path
    }).then(response => {
        return response.data.project;
    });
};

const importProject = path => {
    return axios.post(`http://localhost:${agentPort}/api/project/import`, {
        path: path
    }).then(response => {
        return response.data.project;
    });
};

const saveProject = (path, project) => {
    return axios.post(`http://localhost:${agentPort}/api/project/save`, {
        path: path,
        project: project
    }).then(response => {
        return response.data;
    });
};

const defaultState = () => {
    return {
        activeTab: 0,
        modified: false,
        running: false,
        neverSaved: true,
        path: null
    };
};

export { newTab, newProject, openProject, importProject, saveProject, defaultState };
