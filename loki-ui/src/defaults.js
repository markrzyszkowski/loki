import { v4 as uuid } from 'uuid';

const defaultTab = () => {
    return {
        id: uuid(),
        name: 'Untitled mock',
        url: 'http://a',
        rules: []
    };
};

const defaultProject = () => {
    return {
        id: uuid(),
        name: 'Untitled project',
        settings: {
            profile: 'STATIC',
            port: 0
        },
        tabs: [
            defaultTab()
        ]
    };
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

export { defaultTab, defaultProject, defaultState };
