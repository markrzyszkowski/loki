import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: '48px',
        flexShrink: 0,
        borderRadius: 0
    }
}));

function ProjectTabScrollButton(props) {
    const {direction, visible, onClick} = props;

    const classes = useStyles();

    return (
        <Button
            disabled={!visible}
            onClick={onClick}
            role={null}
            tabIndex={null}
            className={classes.root}>
            {direction === 'left' ? <ArrowLeft/> : <ArrowRight/>}
        </Button>
    );
}

ProjectTabScrollButton.propTypes = {
    direction: PropTypes.oneOf(['left', 'right']).isRequired,
    visible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default ProjectTabScrollButton;
