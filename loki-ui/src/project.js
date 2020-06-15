import axios from 'axios';
import { agentPort } from './agent';

const openProject = path => {
    return axios.post(`http://localhost:${agentPort}/api/project/open`, {
        path: path
    }).then(response => {
        return response.data.project;
    });
};

const importProject = (path, type) => {
    return axios.post(`http://localhost:${agentPort}/api/project/import`, {
        path: path,
        type: type
    }).then(response => {
        return response.data.project;
    });
};

const exportProject = (path, type, project) => {
    return axios.post(`http://localhost:${agentPort}/api/project/export`, {
        path: path,
        type: type,
        project: project
    }).then(response => {
        return response.data;
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

export { openProject, importProject, exportProject, saveProject };
