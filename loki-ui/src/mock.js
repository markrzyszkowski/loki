import axios from 'axios';
import { agentPort } from './agent';

const startMock = project => {
    return axios.post(`http://localhost:${agentPort}/api/mock/start`, {
        id: project.id,
        settings: project.settings,
        mocks: project.tabs.map(tab => {
            return {
                id: tab.id,
                url: tab.url,
                rules: tab.rules
            };
        })
    }).then(response => {
        return response.data.appliedConfiguration;
    });
};

const stopMock = project => {
    return axios.post(`http://localhost:${agentPort}/api/mock/stop`, {
        id: project.id
    }).then(response => {
        return response.data;
    });
};

export { startMock, stopMock };
