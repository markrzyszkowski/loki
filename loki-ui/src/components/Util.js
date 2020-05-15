import React from 'react';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import { useScrollTrigger } from '@material-ui/core';
import { KeyboardArrowUp } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import * as PropTypes from 'prop-types';
import { ellipsis } from '../util';

const useStyles = makeStyles(theme => ({
    scrollTopButton: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}));

function Alert(props) {
    const {alert} = props;

    const handleClose = () => {
        alert.hide();
    };

    return (
        <Snackbar open={alert.open} autoHideDuration={5000} onClose={handleClose}>
            <MuiAlert elevation={6} variant="filled" severity={alert.severity} onClose={handleClose}>
                {alert.message}
            </MuiAlert>
        </Snackbar>
    );
}

function EllipsizeWithTooltip(props) {
    const {text, maxLength, interactive} = props;

    return (
        <>
            {text.length <= maxLength && <div>{text}</div>}
            {text.length > maxLength &&
             <Tooltip title={text} interactive={interactive}>
                 <div>{ellipsis(text, maxLength)}</div>
             </Tooltip>}
        </>
    );
}

function ScrollTopButton(props) {
    const {anchor} = props;

    const trigger = useScrollTrigger({disableHysteresis: true});

    const classes = useStyles();

    const handleClick = () => {
        const scrollAnchor = document.getElementById(anchor);

        if (scrollAnchor) {
            scrollAnchor.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    };

    return (
        <Zoom in={trigger}>
            <Fab color="secondary" onClick={handleClick} className={classes.scrollTopButton}>
                <KeyboardArrowUp/>
            </Fab>
        </Zoom>
    );
}

Alert.propTypes = {
    alert: PropTypes.object.isRequired
};

EllipsizeWithTooltip.propTypes = {
    text: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired,
    interactive: PropTypes.bool.isRequired
};

ScrollTopButton.propTypes = {
    anchor: PropTypes.string.isRequired
};

export { Alert, EllipsizeWithTooltip, ScrollTopButton };
