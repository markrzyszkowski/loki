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
import { newTab } from '../project';
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
    const {project, projectState, index, onModifyProject, onModifyProjectState} = props;

    const classes = useStyles();

    const handleSelectTab = (_, value) => {
        onModifyProjectState(index, {activeTab: value});
    };

    const handleAddTab = () => {
        const tab = newTab();

        const warningsCopy = {...projectState.warnings};
        validators.url({...project, tabs: [...project.tabs, tab]}, warningsCopy);

        onModifyProject(index, {tabs: [...project.tabs, tab]});
        onModifyProjectState(index, {activeTab: project.tabs.length, modified: true, warnings: warningsCopy});
    };

    const handleModifyTab = (tabIndex, properties, field) => {
        const tabsCopy = [...project.tabs];
        tabsCopy[tabIndex] = {...tabsCopy[tabIndex], ...properties};

        const warningsCopy = {...projectState.warnings};
        if (field) {
            const validate = validators[field];

            if (field === 'url') {
                validate({...project, tabs: tabsCopy}, warningsCopy);
            } else {
                // non url field validation
            }
        }

        onModifyProject(index, {tabs: tabsCopy});
        onModifyProjectState(index, {modified: true, warnings: warningsCopy});
    };

    const handleDuplicateTab = tabIndex => {
        const tabCopy = {...project.tabs[tabIndex]};

        const tabId = uuid();

        const tabsCopy = [...project.tabs, {...tabCopy, id: tabId, name: `Copy of ${tabCopy.name}`}];

        const warningsCopy = {...projectState.warnings};
        warningsCopy[tabId] = warningsCopy[project.tabs[tabIndex].id];
        validators.url({...project, tabs: tabsCopy}, warningsCopy);

        onModifyProject(index, {tabs: tabsCopy});
        onModifyProjectState(index, {activeTab: project.tabs.length, warnings: warningsCopy});
    };

    const handleDeleteTab = tabIndex => {
        if (project.tabs.length) {
            const tabsCopy = [...project.tabs];
            tabsCopy.splice(tabIndex, 1);

            const warningsCopy = {...projectState.warnings};
            delete warningsCopy[project.tabs[tabIndex].id];
            validators.url({...project, tabs: tabsCopy}, warningsCopy);

            onModifyProject(index, {tabs: tabsCopy});

            if (tabIndex === projectState.activeTab && tabIndex === 0) {
                onModifyProjectState(index, {activeTab: 0, warnings: warningsCopy});
            } else if (tabIndex <= projectState.activeTab) {
                onModifyProjectState(index, {activeTab: projectState.activeTab - 1, warnings: warningsCopy});
            } else {
                onModifyProjectState(index, {warnings: warningsCopy});
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
                    value={projectState.activeTab}
                    onChange={handleSelectTab}
                >
                    {project.tabs.map((tab, index) =>
                        <ProjectTab
                            key={tab.id}
                            tab={tab}
                            index={index}
                            warnings={projectState.warnings[tab.id] || {}}
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
                 tab={project.tabs[projectState.activeTab]}
                 index={projectState.activeTab}
                 settings={project.settings}
                 warnings={projectState.warnings[project.tabs[projectState.activeTab].id] || {}}
                 isRunning={projectState.running}
                 activePort={projectState.activePort}
                 activeUrls={projectState.activeUrls}
                 onModifyTab={handleModifyTab}
             />}
            <ScrollTopButton anchor="scroll-top-anchor"/>
        </>
    );
}

Project.propTypes = {
    project: PropTypes.object.isRequired,
    projectState: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onModifyProject: PropTypes.func.isRequired,
    onModifyProjectState: PropTypes.func.isRequired
};

export default Project;
