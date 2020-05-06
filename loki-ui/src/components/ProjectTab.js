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
import { EllipsizeWithTooltip } from './Util';

const useStyles = makeStyles(theme => ({
    warning: {
        color: 'red',
        fontWeight: 'bold'
    }
}));

function ProjectTab(props) {
    const {tab, index, warnings, onModifyTab, onDeleteTab, ...other} = props;

    const [menuState, setMenuState] = useState({mouseY: null, mouseX: null});
    const [dialogError, setDialogError] = useState(false);
    const [showModifyTabDialog, setShowModifyTabDialog] = useState(false);
    const [showDeleteTabDialog, setShowDeleteTabDialog] = useState(false);

    const classes = useStyles();

    const handleModifyTab = event => {
        handleCloseMenu(event);
        setShowModifyTabDialog(true);
    };

    const handleDeleteTab = event => {
        handleCloseMenu(event);
        setShowDeleteTabDialog(true);
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
        const text = document.getElementById(`new-tab-name-${index}`).value.trim();
        if (text) {
            if (text !== tab.name) {
                onModifyTab(index, {name: text});
            }
            setDialogError(false);
            setShowModifyTabDialog(false);
        } else {
            setDialogError(true);
        }
    };

    const handleCancelModifyAction = () => {
        setShowModifyTabDialog(false);
    };

    const handleDeleteAction = () => {
        setShowDeleteTabDialog(false);
        onDeleteTab(index);
    };

    const handleCancelDeleteAction = () => {
        setShowDeleteTabDialog(false);
    };

    return (
        <>
            <Tab component="div" onContextMenu={handleOpenMenu} label={
                <>
                    <EllipsizeWithTooltip text={tab.name} maxLength={16} interactive={false}/>
                    <Menu
                        open={menuState.mouseY !== null}
                        onClose={handleCloseMenu}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            menuState.mouseY !== null && menuState.mouseX !== null
                            ? {top: menuState.mouseY, left: menuState.mouseX}
                            : undefined}
                    >
                        <MenuItem onClick={handleModifyTab}>Edit</MenuItem>
                        <MenuItem onClick={handleDeleteTab}>Delete</MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
                    </Menu>
                </>
            } classes={{root: !!Object.keys(warnings).length ? classes.warning : null}} {...other}/>
            <Dialog open={showModifyTabDialog} onClose={handleCancelModifyAction}>
                <DialogTitle>{tab.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        error={dialogError}
                        id={`new-tab-name-${index}`}
                        margin="dense"
                        label="New name"
                        defaultValue={tab.name}
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
            <Dialog open={showDeleteTabDialog} onClose={handleCancelDeleteAction}>
                <DialogTitle>Delete {tab.name}?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDeleteAction} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteAction} color="primary">
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
    onDeleteTab: PropTypes.func.isRequired
};

export default ProjectTab;
