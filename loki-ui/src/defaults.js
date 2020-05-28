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
            port: 0,
            blockRemoteRequests: false,
            maxRequestSize: 10
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
        port: 0,
        urls: {}
    };
};

const defaultRule = () => {
    return {
        id: uuid(),
        name: `Untitled rule`,
        request: {
            method: 'GET',
            methodCondition: 'EQUAL',
            headers: [],
            parameters: [],
            body: '',
            bodyCondition: 'NOT_PRESENT',
            bodyIgnoreCase: false,
            bodyIgnoreWhitespace: false,
            expanded: true,
            headersExpanded: true,
            parametersExpanded: true
        },
        response: {
            statusCode: 200,
            headers: [],
            body: '',
            expanded: true,
            headersExpanded: true
        },
        active: true,
        expanded: true
    };
};

const defaultHeader = () => {
    return {
        key: '',
        value: ''
    };
};

const defaultHeaderWithConditions = () => {
    return {
        key: '',
        value: '',
        condition: 'EQUAL',
        valueIgnoreCase: false
    };
};

const defaultParameterWithConditions = () => {
    return {
        key: '',
        value: '',
        condition: 'EQUAL',
        keyIgnoreCase: false,
        valueIgnoreCase: false
    };
};

export {
    defaultTab,
    defaultProject,
    defaultState,
    defaultRule,
    defaultHeader,
    defaultHeaderWithConditions,
    defaultParameterWithConditions
};
