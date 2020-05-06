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
import { validators } from '../warning';

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
        const tab = newTab();

        const warningsCopy = {...projectState.warnings};
        validators.url({...project, tabs: [...project.tabs, tab]}, warningsCopy);

        onModifyProject(index, {tabs: [...project.tabs, tab]});
        onModifyProjectState(index, {activeTab: project.tabs.length, modified: true, warnings: warningsCopy});
    };

    const handleModifyTab = (tabIndex, tabProperties, field) => {
        const tabsCopy = [...project.tabs];
        tabsCopy[tabIndex] = {...tabsCopy[tabIndex], ...tabProperties};

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

    const handleDeleteTab = tabIndex => {
        if (project.tabs.length) {
            const tabsCopy = [...project.tabs];
            tabsCopy.splice(tabIndex, 1);

            const warningsCopy = {...projectState.warnings};
            delete warningsCopy[project.tabs[tabIndex].id];

            onModifyProject(index, {tabs: tabsCopy});

            if (tabIndex === projectState.activeTab && tabIndex === 0) {
                onModifyProjectState(index, {activeTab: 0, warnings: warningsCopy});
            } else if (tabIndex <= projectState.activeTab) {
                onModifyProjectState(index, {activeTab: projectState.activeTab - 1, warnings: warningsCopy});
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
                            warnings={projectState.warnings[tab.id] || {}}
                            onModifyTab={handleModifyTab}
                            onDeleteTab={handleDeleteTab}
                        />)}
                </Tabs>
                <Button onClick={handleAddTab} className={classes.square}>
                    <Add/>
                </Button>
            </Paper>
            {!!project.tabs.length && <ProjectContent
                tab={project.tabs[projectState.activeTab]}
                index={projectState.activeTab}
                warnings={projectState.warnings[project.tabs[projectState.activeTab].id] || {}}
                onModifyTab={handleModifyTab}
            />}
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
