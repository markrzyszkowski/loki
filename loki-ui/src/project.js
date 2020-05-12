import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { agentPort } from './agent';

const newTab = () => {
    return {
        id: uuid(),
        name: 'Untitled mock',
        url: '',
        rules: []
    };
};

const newProject = () => {
    return {
        id: uuid(),
        name: 'Untitled project',
        settings: {
            profile: 'STATIC',
            port: 0
        },
        tabs: [
            newTab()
        ]
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
        waiting: false,
        neverSaved: true,
        path: null,
        warnings: {},
        activePort: 0,
        activeUrls: {}
    };
};

export { newTab, newProject, openProject, importProject, saveProject, defaultState };
