import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import { ExpandMore, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';

function RuleHeading(props) {
    const {rule, index, lastIndex, onShiftRule, onModifyRule, onDeleteRule} = props;

    const [menuPosition, setMenuPosition] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogError, setDialogError] = useState(false);

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

    const ignoreEvent = event => {
        event.stopPropagation();
    };

    const handleActiveChange = event => {
        const active = event.target.checked;

        onModifyRule(index, {active: active});
    };

    const handleShiftRuleUp = event => {
        handleCloseMenu(event);

        onShiftRule(index, -1);
    };

    const handleShiftRuleDown = event => {
        handleCloseMenu(event);

        onShiftRule(index, 1);
    };

    const handleRenameRule = () => {
        const name = document.getElementById(`new-rule-name-${index}`).value.trim();

        if (name) {
            if (name !== rule.name) {
                onModifyRule(index, {name: name});
            }
            setShowDialog(false);
            setDialogError(false);
        } else {
            setDialogError(true);
        }
    };

    const handleDeleteRule = event => {
        handleCloseMenu(event);

        onDeleteRule(index);
    };

    return (
        <>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>} onContextMenu={handleOpenMenu}>
                <FormControlLabel
                    disabled={index === 0}
                    onClick={ignoreEvent}
                    onFocus={ignoreEvent}
                    control={<IconButton size="small" onClick={handleShiftRuleUp}><KeyboardArrowUp/></IconButton>}
                    label=""
                />
                <FormControlLabel
                    disabled={index === lastIndex}
                    onClick={ignoreEvent}
                    onFocus={ignoreEvent}
                    control={<IconButton size="small" onClick={handleShiftRuleDown}><KeyboardArrowDown/></IconButton>}
                    label=""
                />
                <FormControlLabel
                    onClick={ignoreEvent}
                    onFocus={ignoreEvent}
                    control={<Checkbox checked={rule.active} onChange={handleActiveChange}/>}
                    label={<b>{rule.name}</b>}
                />
                <Menu open={!!menuPosition} onClose={handleCloseMenu} anchorReference="anchorPosition" anchorPosition={menuPosition}>
                    <MenuItem onClick={handleOpenDialog}>Rename</MenuItem>
                    <MenuItem onClick={handleDeleteRule}>Delete</MenuItem>
                    <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
                </Menu>
            </ExpansionPanelSummary>
            <Dialog open={showDialog} onClose={handleCloseDialog}>
                <DialogTitle>Rename {rule.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        error={dialogError}
                        id={`new-rule-name-${index}`}
                        margin="dense"
                        label="New name"
                        defaultValue={rule.name}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleRenameRule} color="primary">
                        Set
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

RuleHeading.propTypes = {
    rule: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    lastIndex: PropTypes.number.isRequired,
    onShiftRule: PropTypes.func.isRequired,
    onModifyRule: PropTypes.func.isRequired,
    onDeleteRule: PropTypes.func.isRequired
};

export default RuleHeading;
