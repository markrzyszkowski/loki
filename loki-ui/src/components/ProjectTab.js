import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import Ellipsis from './util/Ellipsis';

const useStyles = makeStyles(theme => ({
    warning: {
        color: 'red',
        fontWeight: 'bold'
    }
}));

function ProjectTab(props) {
    const {tab, index, warnings, onModifyTab, onDuplicateTab, onDeleteTab, ...other} = props;

    const [menuPosition, setMenuPosition] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
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

    const handleOpenConfirmation = event => {
        handleCloseMenu(event);

        setShowConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    const handleRenameTab = () => {
        const name = document.getElementById(`new-tab-name-${index}`).value.trim();

        if (name) {
            if (name !== tab.name) {
                onModifyTab(index, {name: name});
            }
            setShowDialog(false);
            setDialogError(false);
        } else {
            setDialogError(true);
        }
    };

    const handleDuplicateTab = event => {
        handleCloseMenu(event);

        onDuplicateTab(index);
    };

    const handleDeleteTab = () => {
        setShowConfirmation(false);

        onDeleteTab(index);
    };

    const hasWarnings = Object.keys(warnings).length > 0;
    const rootClass = hasWarnings ? classes.warning : null;

    return (
        <>
            <Tab
                component="div"
                onContextMenu={handleOpenMenu}
                label={
                    <>
                        <Ellipsis text={tab.name} maxLength={16} interactive={false}/>
                        <Menu open={!!menuPosition} onClose={handleCloseMenu} anchorReference="anchorPosition" anchorPosition={menuPosition}>
                            <MenuItem onClick={handleOpenDialog}>Rename</MenuItem>
                            <MenuItem onClick={handleDuplicateTab}>Duplicate</MenuItem>
                            <MenuItem onClick={handleOpenConfirmation}>Delete</MenuItem>
                            <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
                        </Menu>
                    </>}
                classes={{root: rootClass}}
                {...other}
            />
            <Dialog open={showDialog} onClose={handleCloseDialog}>
                <DialogTitle>Rename {tab.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        error={dialogError}
                        id={`new-tab-name-${index}`}
                        margin="dense"
                        label="New name"
                        defaultValue={tab.name}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleRenameTab} color="primary">
                        Set
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showConfirmation} onClose={handleCloseConfirmation}>
                <DialogTitle>Delete {tab.name}?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteTab} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

ProjectTab.propTypes = {
    tab: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    warnings: PropTypes.object.isRequired,
    onModifyTab: PropTypes.func.isRequired,
    onDuplicateTab: PropTypes.func.isRequired,
    onDeleteTab: PropTypes.func.isRequired
};

export default ProjectTab;
