import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import ProjectContent from './ProjectContent';
import ProjectTab from './ProjectTab';
import ScrollTabsButton from './util/ScrollTabsButton';
import ScrollTopButton from './util/ScrollTopButton';
import { defaultTab } from '../defaults';
import { validators } from '../warning';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row'
    },
    toolbar: theme.mixins.toolbar,
    square: {
        minWidth: '48px',
        borderRadius: 0
    }
}));

function Project(props) {
    const {project, state, index, onModifyProjectAndState, onModifyState} = props;

    const classes = useStyles();

    const handleSelectTab = (_, value) => {
        onModifyState(index, {activeTab: value});
    };

    const handleAddTab = () => {
        const tab = defaultTab();

        const warningsCopy = {...state.warnings};
        validators.url({...project, tabs: [...project.tabs, tab]}, warningsCopy);

        onModifyProjectAndState(index, {tabs: [...project.tabs, tab]},{activeTab: project.tabs.length, modified: true, warnings: warningsCopy});
    };

    const handleModifyTab = (tabIndex, properties, field) => {
        const tabsCopy = [...project.tabs];
        tabsCopy[tabIndex] = {...tabsCopy[tabIndex], ...properties};

        const warningsCopy = {...state.warnings};
        if (field) {
            const validate = validators[field];

            if (field === 'url') {
                validate({...project, tabs: tabsCopy}, warningsCopy);
            } else {
                // non url field validation
            }
        }

        onModifyProjectAndState(index, {tabs: tabsCopy}, {modified: true, warnings: warningsCopy});
    };

    const handleDuplicateTab = tabIndex => {
        const tabCopy = {...project.tabs[tabIndex]};

        const tabId = uuid();

        const tabsCopy = [...project.tabs, {...tabCopy, id: tabId, name: `Copy of ${tabCopy.name}`}];

        const warningsCopy = {...state.warnings};
        warningsCopy[tabId] = warningsCopy[project.tabs[tabIndex].id];
        validators.url({...project, tabs: tabsCopy}, warningsCopy);

        onModifyProjectAndState(index, {tabs: tabsCopy}, {activeTab: project.tabs.length, warnings: warningsCopy});
    };

    const handleDeleteTab = tabIndex => {
        if (project.tabs.length) {
            const tabsCopy = [...project.tabs];
            tabsCopy.splice(tabIndex, 1);

            const warningsCopy = {...state.warnings};
            delete warningsCopy[project.tabs[tabIndex].id];
            validators.url({...project, tabs: tabsCopy}, warningsCopy);

            if (tabIndex === state.activeTab && tabIndex === 0) {
                onModifyProjectAndState(index, {tabs: tabsCopy}, {activeTab: 0, warnings: warningsCopy});
            } else if (tabIndex <= state.activeTab) {
                onModifyProjectAndState(index, {tabs: tabsCopy}, {activeTab: state.activeTab - 1, warnings: warningsCopy});
            } else {
                onModifyProjectAndState(index, {tabs: tabsCopy}, {warnings: warningsCopy});
            }
        }
    };

    const hasTabs = project.tabs.length > 0;

    return (
        <>
            <div className={classes.toolbar}/>
            <Paper square className={classes.root}>
                <Tabs
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    id="scroll-top-anchor"
                    scrollButtons="on"
                    ScrollButtonComponent={ScrollTabsButton}
                    value={state.activeTab}
                    onChange={handleSelectTab}
                >
                    {project.tabs.map((tab, index) =>
                        <ProjectTab
                            key={tab.id}
                            tab={tab}
                            index={index}
                            warnings={state.warnings[tab.id] || {}}
                            onModifyTab={handleModifyTab}
                            onDuplicateTab={handleDuplicateTab}
                            onDeleteTab={handleDeleteTab}
                        />)}
                </Tabs>
                <Button onClick={handleAddTab} className={classes.square}>
                    <Add/>
                </Button>
            </Paper>
            {hasTabs &&
             <ProjectContent
                 tab={project.tabs[state.activeTab]}
                 index={state.activeTab}
                 settings={project.settings}
                 warnings={state.warnings[project.tabs[state.activeTab].id] || {}}
                 isRunning={state.running}
                 port={state.port}
                 urls={state.urls}
                 onModifyTab={handleModifyTab}
             />}
            <ScrollTopButton anchor="scroll-top-anchor"/>
        </>
    );
}

Project.propTypes = {
    project: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onModifyProjectAndState: PropTypes.func.isRequired,
    onModifyState: PropTypes.func.isRequired
};

export default Project;
