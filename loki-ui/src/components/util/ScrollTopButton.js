import React from 'react';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import { useScrollTrigger } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardArrowUp } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    button: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}));

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
            <Fab color="secondary" onClick={handleClick} className={classes.button}>
                <KeyboardArrowUp/>
            </Fab>
        </Zoom>
    );
}

ScrollTopButton.propTypes = {
    anchor: PropTypes.string.isRequired
};

export default ScrollTopButton;
