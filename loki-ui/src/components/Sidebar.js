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
    projects: {
        padding: 0
    }
}));

function Sidebar(props) {
    const {
        projects,
        currentIndex,
        width,
        onSelectProject,
        onModifyProjectAndState,
        onSaveProject,
        onDuplicateProject,
        onExportProject,
        onCloseProject
    } = props;

    const classes = useStyles({width: width});

    return (
        <Drawer variant="permanent" className={classes.drawer} classes={{paper: classes.drawer}}>
            <div className={classes.offset}/>
            <List className={classes.projects}>
                {projects.map((prj, index) =>
                    <SidebarItem
                        key={prj.project.id}
                        project={prj.project}
                        state={prj.state}
                        index={index}
                        currentIndex={currentIndex}
                        onSelectProject={onSelectProject}
                        onModifyProjectAndState={onModifyProjectAndState}
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
    currentIndex: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onSelectProject: PropTypes.func.isRequired,
    onModifyProjectAndState: PropTypes.func.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    onDuplicateProject: PropTypes.func.isRequired,
    onExportProject: PropTypes.func.isRequired,
    onCloseProject: PropTypes.func.isRequired
};

export default Sidebar;
