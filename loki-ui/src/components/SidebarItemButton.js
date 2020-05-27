import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { Close } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

function SidebarItemButton(props) {
    const {project, state, index, onSaveProject, onCloseProject} = props;

    const [showDialog, setShowDialog] = useState(false);

    const handleOpenDialog = () => {
        if (state.modified) {
            setShowDialog(true);
        } else {
            onCloseProject(index);
        }
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleCloseProject = () => {
        setShowDialog(false);

        onCloseProject(index);
    };

    const handleSaveAndCloseProject = () => {
        setShowDialog(false);

        onSaveProject(index);
        onCloseProject(index);
    };

    return (
        <>
            <IconButton size="small" edge="end" onClick={handleOpenDialog}>
                <Close/>
            </IconButton>
            <Dialog open={showDialog} onClose={handleCloseDialog}>
                <DialogTitle>{project.name} has been modified!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you leave now you will lose any unsaved changes.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveAndCloseProject} color="primary">
                        Save & close
                    </Button>
                    <Button onClick={handleCloseProject} color="secondary">
                        Close anyway
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

SidebarItemButton.propTypes = {
    project: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    onCloseProject: PropTypes.func.isRequired
};

export default SidebarItemButton;
