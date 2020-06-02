import { v4 as uuid } from 'uuid';

const defaultTab = () => {
    return {
        id: uuid(),
        name: 'Untitled mock',
        url: '',
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
            urlVariables: [],
            parameters: [],
            headers: [],
            body: '',
            bodyCondition: 'NOT_PRESENT',
            bodyIgnoreCase: false,
            bodyIgnoreWhitespace: false,
            expanded: true,
            urlVariablesExpanded: false,
            parametersExpanded: false,
            headersExpanded: false
        },
        response: {
            statusCode: 200,
            headers: [],
            body: '',
            expanded: true,
            headersExpanded: false
        },
        active: true,
        expanded: true
    };
};

const defaultUrlVariable = () => {
    return {
        key: '',
        value: '',
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

const defaultHeaderWithConditions = () => {
    return {
        key: '',
        value: '',
        condition: 'EQUAL',
        valueIgnoreCase: false
    };
};

const defaultHeader = () => {
    return {
        key: '',
        value: ''
    };
};

export {
    defaultTab,
    defaultProject,
    defaultState,
    defaultRule,
    defaultUrlVariable,
    defaultParameterWithConditions,
    defaultHeaderWithConditions,
    defaultHeader
};
