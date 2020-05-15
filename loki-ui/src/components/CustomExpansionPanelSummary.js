import React from 'react';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';

export default withStyles({
    root: {
        marginBottom: '-1px',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        '&$expanded': {
            minHeight: '48px'
        },
        backgroundColor: 'rgba(0, 0, 0, .05)'
    },
    content: {
        '&$expanded': {
            marginTop: '12px',
            marginBottom: '12px'
        }
    },
    expanded: {}
})(ExpansionPanelSummary);
