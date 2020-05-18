import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Error, Save } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import SidebarItemButton from './SidebarItemButton';
import Ellipsis from './util/Ellipsis';
import { warningCount } from '../warning';

const useStyles = makeStyles(theme => ({
    default: {
        marginRight: '4px'
    },
    running: {
        borderRight: '4px solid green'
    },
    modified: {
        borderRight: '4px solid red'
    }
}));

function SidebarItem(props) {
    const {
        project,
        projectState,
        index,
        currentIndex,
        onSelectProject,
        onModifyProject,
        onModifyProjectState,
        onSaveProject,
        onDuplicateProject,
        onCloseProject
    } = props;

    const [menuPosition, setMenuPosition] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogError, setDialogError] = useState(false);

    const classes = useStyles();

    const handleOpenMenu = event => {
        event.preventDefault();

        setMenuPosition({
            top: event.clientY - 4,
            left: event.clientX - 2
        });
    };

    const handleCloseMenu = event => {
        event.stopPropagation();

        setMenuPosition(null);
    };

    const handleOpenDialog = event => {
        handleCloseMenu(event);

        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleSelectProject = () => {
        onSelectProject(index);
    };

    const handleSaveProject = event => {
        handleCloseMenu(event);

        onSaveProject(index);
    };

    const handleRenameProject = () => {
        const name = document.getElementById(`new-project-name-${index}`).value.trim();

        if (name) {
            if (name !== project.name) {
                onModifyProject(index, {name: name});
                onModifyProjectState(index, {modified: true});
            }
            setShowDialog(false);
            setDialogError(false);
        } else {
            setDialogError(true);
        }
    };

    const handleDuplicateProject = event => {
        handleCloseMenu(event);

        onDuplicateProject(index);
    };

    const selected = index === currentIndex;
    const containerClass = projectState.running && projectState.modified
                           ? classes.modified
                           : projectState.running ? classes.running : classes.default;
    const hasWarnings = warningCount(projectState.warnings) > 0;
    const unsaved = projectState.modified || projectState.neverSaved;
    const showMenu = !!menuPosition;

    return (
        <>
            <ListItem
                button
                selected={selected}
                onClick={handleSelectProject}
                onContextMenu={handleOpenMenu}
                classes={{container: containerClass}}
            >
                <ListItemText primary={
                    <Ellipsis text={project.name} maxLength={20} interactive={false}/>
                }/>
                {hasWarnings && <Error color="secondary"/>}
                {unsaved && <Save color={projectState.modified ? 'secondary' : 'primary'}/>}
                <Menu open={showMenu} onClose={handleCloseMenu} anchorReference="anchorPosition" anchorPosition={menuPosition}>
                    {unsaved && <MenuItem onClick={handleSaveProject}>Save</MenuItem>}
                    <MenuItem onClick={handleOpenDialog}>Rename</MenuItem>
                    <MenuItem onClick={handleDuplicateProject}>Duplicate</MenuItem>
                    <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
                </Menu>
                <ListItemSecondaryAction>
                    <SidebarItemButton
                        project={project}
                        projectState={projectState}
                        index={index}
                        onSaveProject={onSaveProject}
                        onCloseProject={onCloseProject}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <Dialog open={showDialog} onClose={handleCloseDialog}>
                <DialogTitle>Rename {project.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        error={dialogError}
                        id={`new-project-name-${index}`}
                        margin="dense"
                        label="New name"
                        defaultValue={project.name}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleRenameProject} color="primary">
                        Set
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

SidebarItem.propTypes = {
    project: PropTypes.object.isRequired,
    projectState: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    currentIndex: PropTypes.number.isRequired,
    onSelectProject: PropTypes.func.isRequired,
    onModifyProject: PropTypes.func.isRequired,
    onModifyProjectState: PropTypes.func.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    onDuplicateProject: PropTypes.func.isRequired,
    onCloseProject: PropTypes.func.isRequired
};

export default SidebarItem;
