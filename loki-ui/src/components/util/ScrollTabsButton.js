import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    button: {
        minWidth: 48,
        flexShrink: 0,
        borderRadius: 0
    }
}));

function ScrollTabsButton(props) {
    const {direction, visible, onClick} = props;

    const classes = useStyles();

    const left = direction === 'left';

    return (
        <Button
            disabled={!visible}
            onClick={onClick}
            className={classes.button}>
            {left ? <ArrowLeft/> : <ArrowRight/>}
        </Button>
    );
}

ScrollTabsButton.propTypes = {
    direction: PropTypes.oneOf(['left', 'right']).isRequired,
    visible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default ScrollTabsButton;
