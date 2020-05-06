import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    }
}));

function ProjectContent(props) {
    const {tab, index, warnings, onModifyTab} = props;

    const classes = useStyles();

    const handleUrlChange = event => {
        const text = event.target.value;
        if (text !== tab.url) {
            onModifyTab(index, {url: text});
        }
    };

    return (
        <div role="tabpanel" className={classes.root}>
            <TextField label="URL" placeholder="Enter request URL" value={tab.url} onChange={handleUrlChange} fullWidth/>
        </div>
    );
}

ProjectContent.propTypes = {
    tab: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    warnings: PropTypes.object.isRequired,
    onModifyTab: PropTypes.func.isRequired
};

export default ProjectContent;
