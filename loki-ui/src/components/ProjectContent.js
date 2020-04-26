import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    }
}));

function ProjectContent(props) {
    const {tab} = props;

    const classes = useStyles();

    return (
        <div role="tabpanel" className={classes.root}>
            {tab.name}
        </div>
    );
}

ProjectContent.propTypes = {
    tab: PropTypes.object.isRequired
};

export default ProjectContent;
