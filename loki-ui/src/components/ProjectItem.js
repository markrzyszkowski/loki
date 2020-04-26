import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Close, Save } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import { EllipsizeWithTooltip } from './Util';

const useStyles = makeStyles(theme => ({
    default: {
        marginRight: '4px'
    },
    running: {
        borderRight: '4px solid green'
    }
}));

function ProjectItem(props) {
    const {
        project,
        projectState,
        index,
        currentIndex,
        onSelectProject,
        onModifyProject,
        onModifyProjectState,
        onSaveProject,
        onCloseProject
    } = props;

    const [menuState, setMenuState] = useState({mouseY: null, mouseX: null});
    const [dialogError, setDialogError] = useState(false);
    const [showModifyProjectDialog, setShowModifyProjectDialog] = useState(false);
    const [showCloseProjectDialog, setShowCloseProjectDialog] = useState(false);

    const classes = useStyles();

    const handleSelectProject = () => {
        onSelectProject(index);
    };

    const handleModifyProject = event => {
        handleCloseMenu(event);
        setShowModifyProjectDialog(true);
    };

    const handleSaveProject = event => {
        handleCloseMenu(event);
        onSaveProject(index);
    };

    const handleCloseProject = () => {
        if (projectState.modified) {
            setShowCloseProjectDialog(true);
        } else {
            onCloseProject(index);
        }
    };

    const handleOpenMenu = event => {
        event.preventDefault();
        setMenuState({
            mouseY: event.clientY - 4,
            mouseX: event.clientX - 2
        });
    };

    const handleCloseMenu = event => {
        event.stopPropagation();
        setMenuState({mouseY: null, mouseX: null});
    };

    const handleModifyAction = () => {
        const text = document.getElementById(`new-project-name-${index}`).value.trim();
        if (text) {
            if (text !== project.name) {
                onModifyProject(index, {name: text});
                onModifyProjectState(index, {modified: true});
            }
            setDialogError(false);
            setShowModifyProjectDialog(false);
        } else {
            setDialogError(true);
        }
    };

    const handleCancelModifyAction = () => {
        setShowModifyProjectDialog(false);
    };

    const handleCloseAction = () => {
        setShowCloseProjectDialog(false);
        onCloseProject(index);
    };

    const handleCloseWithSaveAction = () => {
        onSaveProject(index);
        setShowCloseProjectDialog(false);
        onCloseProject(index);
    };

    const handleCancelCloseAction = () => {
        setShowCloseProjectDialog(false);
    };

    return (
        <>
            <ListItem
                button
                selected={index === currentIndex}
                onClick={handleSelectProject}
                onContextMenu={handleOpenMenu}
                classes={{container: projectState.running ? classes.running : classes.default}}
            >
                <ListItemText primary={<EllipsizeWithTooltip text={project.name} maxLength={16} interactive={false}/>}/>
                {!projectState.modified && projectState.neverSaved && <Save color="primary"/>}
                {projectState.modified && <Save color="secondary"/>}
                <Menu
                    open={menuState.mouseY !== null}
                    onClose={handleCloseMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        menuState.mouseY !== null && menuState.mouseX !== null
                        ? {top: menuState.mouseY, left: menuState.mouseX}
                        : undefined}
                >
                    {(projectState.modified || projectState.neverSaved) && <MenuItem onClick={handleSaveProject}>Save</MenuItem>}
                    <MenuItem onClick={handleModifyProject}>Edit</MenuItem>
                    <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
                </Menu>
                <ListItemSecondaryAction>
                    <IconButton size="small" edge="end" onClick={handleCloseProject}>
                        <Close/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Dialog open={showModifyProjectDialog} onClose={handleCancelModifyAction}>
                <DialogTitle>{project.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        error={dialogError}
                        id={`new-project-name-${index}`}
                        margin="dense"
                        label="New name"
                        defaultValue={project.name}
                        fullWidth/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelModifyAction} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleModifyAction} color="primary">
                        Set
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showCloseProjectDialog} onClose={handleCancelCloseAction}>
                <DialogTitle>{project.name} has been modified!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you leave now you will lose any unsaved changes.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelCloseAction} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCloseWithSaveAction} color="primary">
                        Save & close
                    </Button>
                    <Button onClick={handleCloseAction} color="secondary">
                        Close anyway
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

ProjectItem.propTypes = {
    project: PropTypes.object.isRequired,
    projectState: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    currentIndex: PropTypes.number.isRequired,
    onSelectProject: PropTypes.func.isRequired,
    onModifyProject: PropTypes.func.isRequired,
    onModifyProjectState: PropTypes.func.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    onCloseProject: PropTypes.func.isRequired
};

export default ProjectItem;
