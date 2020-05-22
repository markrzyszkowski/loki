import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import SidebarItem from './SidebarItem';

const useStyles = makeStyles(theme => ({
    drawer: {
        width: props => props.width,
        flexShrink: 0
    },
    offset: theme.mixins.toolbar,
    projectsList: {
        padding: 0
    }
}));

function Sidebar(props) {
    const {
        projects,
        projectStates,
        currentIndex,
        width,
        onSelectProject,
        onModifyProject,
        onModifyProjectState,
        onSaveProject,
        onDuplicateProject,
        onExportProject,
        onCloseProject
    } = props;

    const classes = useStyles({width: width});

    return (
        <Drawer variant="permanent" className={classes.drawer} classes={{paper: classes.drawer}}>
            <div className={classes.offset}/>
            <List className={classes.projectsList}>
                {projects.map((project, index) =>
                    <SidebarItem
                        key={project.id}
                        project={project}
                        projectState={projectStates[index]}
                        index={index}
                        currentIndex={currentIndex}
                        onSelectProject={onSelectProject}
                        onModifyProject={onModifyProject}
                        onModifyProjectState={onModifyProjectState}
                        onSaveProject={onSaveProject}
                        onDuplicateProject={onDuplicateProject}
                        onExportProject={onExportProject}
                        onCloseProject={onCloseProject}
                    />)}
            </List>
        </Drawer>
    );
}

Sidebar.propTypes = {
    projects: PropTypes.array.isRequired,
    projectStates: PropTypes.array.isRequired,
    currentIndex: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onSelectProject: PropTypes.func.isRequired,
    onModifyProject: PropTypes.func.isRequired,
    onModifyProjectState: PropTypes.func.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    onDuplicateProject: PropTypes.func.isRequired,
    onExportProject: PropTypes.func.isRequired,
    onCloseProject: PropTypes.func.isRequired
};

export default Sidebar;
