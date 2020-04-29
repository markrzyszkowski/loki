import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import ProjectContent from './ProjectContent';
import ProjectTab from './ProjectTab';
import ProjectTabScrollButton from './ProjectTabScrollButton';
import { newTab } from '../project';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row'
    },
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
        onModifyProject(index, {tabs: [...project.tabs, newTab()]});
        onModifyProjectState(index, {modified: true, activeTab: project.tabs.length});
    };

    const handleModifyTab = (tabIndex, tabProperties) => {
        const tabsCopy = [...project.tabs];
        tabsCopy[tabIndex] = {...tabsCopy[tabIndex], ...tabProperties};

        onModifyProject(index, {tabs: tabsCopy});
        onModifyProjectState(index, {modified: true});
    };

    const handleDeleteTab = tabIndex => {
        if (project.tabs.length) {
            const tabsCopy = [...project.tabs];
            tabsCopy.splice(tabIndex, 1);

            const warningsCopy = projectState.warnings.filter(warning => project.tabs[tabIndex].id !== warning.tabId);

            onModifyProject(index, {tabs: tabsCopy, warnings: warningsCopy});

            if (tabIndex === projectState.activeTab && tabIndex === 0) {
                onModifyProjectState(index, {activeTab: 0});
            } else if (tabIndex <= projectState.activeTab) {
                onModifyProjectState(index, {activeTab: projectState.activeTab - 1});
            }
        }
    };

    return (
        <>
            <Paper square className={classes.root}>
                <Tabs
                    value={projectState.activeTab}
                    onChange={handleSelectTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                    ScrollButtonComponent={ProjectTabScrollButton}
                >
                    {project.tabs.map((tab, index) =>
                        <ProjectTab
                            tab={tab}
                            index={index}
                            onModifyTab={handleModifyTab}
                            onDeleteTab={handleDeleteTab}
                        />)}
                </Tabs>
                <Button onClick={handleAddTab} className={classes.square}>
                    <Add/>
                </Button>
            </Paper>
            {!!project.tabs.length && <ProjectContent tab={project.tabs[projectState.activeTab]}/>}
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
