import React, { useState } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { ExpandMore, KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import ExpansionPanelSummary from './CustomExpansionPanelSummary';
import Response from './Response';
import Request from './Request';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'block',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    grow: {
        flexGrow: 1
    }
}));

function Rule(props) {
    const {rule, index, lastIndex, onModifyRule, onShiftRule, onDeleteRule} = props;

    const [menuState, setMenuState] = useState({mouseY: null, mouseX: null});
    const [dialogError, setDialogError] = useState(false);
    const [showModifyRuleDialog, setShowModifyRuleDialog] = useState(false);

    const classes = useStyles();

    const handleExpandedStateChange = (_, expanded) => {
        onModifyRule(index, {expanded: expanded});
    };

    const handleActiveStateChange = event => {
        onModifyRule(index, {active: event.target.checked});
    };

    const handleModifyRequest = properties => {
        onModifyRule(index, {request: {...rule.request, ...properties}});
    };

    const handleModifyResponse = properties => {
        onModifyRule(index, {response: {...rule.response, ...properties}});
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

    const handleShiftRuleUp = event => {
        handleCloseMenu(event);
        onShiftRule(index, -1);
    };

    const handleShiftRuleDown = event => {
        handleCloseMenu(event);
        onShiftRule(index, 1);
    };

    const handleModifyRule = event => {
        handleCloseMenu(event);
        setShowModifyRuleDialog(true);
    };

    const handleDeleteRule = event => {
        handleCloseMenu(event);
        onDeleteRule(index);
    };

    const handleModifyAction = () => {
        const text = document.getElementById(`new-rule-name-${index}`).value.trim();
        if (text) {
            if (text !== rule.name) {
                onModifyRule(index, {name: text});
            }
            setDialogError(false);
            setShowModifyRuleDialog(false);
        } else {
            setDialogError(true);
        }
    };

    const handleCancelModifyAction = () => {
        setShowModifyRuleDialog(false);
    };

    return (
        <>
            <ExpansionPanel square expanded={rule.expanded} onChange={handleExpandedStateChange}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMore/>}
                    onContextMenu={handleOpenMenu}
                    className={classes.summary}
                >
                    <FormControlLabel
                        disabled={index === 0}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<IconButton size="small" onClick={handleShiftRuleUp}><KeyboardArrowUp/></IconButton>}
                        label=""
                    />
                    <FormControlLabel
                        disabled={index === lastIndex}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<IconButton size="small" onClick={handleShiftRuleDown}><KeyboardArrowDown/></IconButton>}
                        label=""
                    />
                    <FormControlLabel
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Checkbox checked={rule.active} onChange={handleActiveStateChange}/>}
                        label={<b>{rule.name}</b>}
                    />
                    <Menu
                        open={menuState.mouseY !== null}
                        onClose={handleCloseMenu}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            menuState.mouseY !== null && menuState.mouseX !== null
                            ? {top: menuState.mouseY, left: menuState.mouseX}
                            : undefined}
                    >
                        <MenuItem onClick={handleModifyRule}>Edit</MenuItem>
                        <MenuItem onClick={handleDeleteRule}>Delete</MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
                    </Menu>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.wrapper}>
                    <Request request={rule.request} onModifyRequest={handleModifyRequest}/>
                    <Response response={rule.response} onModifyResponse={handleModifyResponse}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <Dialog open={showModifyRuleDialog} onClose={handleCancelModifyAction}>
                <DialogTitle>{rule.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        error={dialogError}
                        id={`new-rule-name-${index}`}
                        margin="dense"
                        label="New name"
                        defaultValue={rule.name}
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
        </>
    );
}

Rule.propTypes = {
    rule: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    lastIndex: PropTypes.number.isRequired,
    onModifyRule: PropTypes.func.isRequired,
    onShiftRule: PropTypes.func.isRequired,
    onDeleteRule: PropTypes.func.isRequired
};

export default Rule;
