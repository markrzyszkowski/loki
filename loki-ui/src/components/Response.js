import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import ResponseHeaders from './ResponseHeaders';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { validators } from '../warnings';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'block',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    statusCodeField: {
        flexGrow: 1,
        margin: theme.spacing(1)
    },
    panels: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    panelsOffset: {
        marginTop: 1,
        marginBottom: theme.spacing(3)
    },
    bodyField: {
        flexGrow: 1,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    warning: {
        color: 'red',
        fontWeight: 'bold'
    }
}));

function Response(props) {
    const {response, ruleId, warnings, onModifyResponse} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyResponse({expanded: expanded});
    };

    const handleStatusCodeChange = event => {
        const statusCode = event.target.value.trim();

        if (statusCode !== response.statusCode) {
            const warningsCopy = {...warnings};
            validators.statusCode(statusCode, ruleId, warningsCopy);

            onModifyResponse({statusCode: statusCode}, warningsCopy);
        }
    };

    const handleBodyChange = event => {
        const body = event.target.value;

        if (body !== response.body) {
            onModifyResponse({body: body}, warnings);
        }
    };

    const hasWarnings = Object.keys(warnings).filter(id => id.startsWith(`${ruleId}-response`)).length > 0;
    const headingClass = hasWarnings ? classes.warning : null;
    const statusCodeWarning = warnings[`${ruleId}-response-statusCode`];
    const panelsClass = clsx(!statusCodeWarning && classes.panels, !!statusCodeWarning && classes.panelsOffset);

    return (
        <ExpansionPanel square expanded={response.expanded} onChange={handleStateChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography className={headingClass}>Response</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <FormGroup row>
                    <TextField
                        error={!!statusCodeWarning}
                        helperText={statusCodeWarning}
                        variant="outlined"
                        size="small"
                        label="Status code"
                        placeholder="Enter status code"
                        value={response.statusCode}
                        type="number"
                        inputProps={{min: 100, max: 599}}
                        onChange={handleStatusCodeChange}
                        className={classes.statusCodeField}
                    />
                </FormGroup>
                <div className={panelsClass}>
                    <ResponseHeaders
                        headers={response.headers}
                        headersExpanded={response.headersExpanded}
                        ruleId={ruleId}
                        warnings={warnings}
                        onModifyResponse={onModifyResponse}
                    />
                </div>
                <FormGroup row>
                    <TextField
                        error={!!warnings[`${ruleId}-response-body`]}
                        helperText={warnings[`${ruleId}-response-body`]}
                        variant="outlined"
                        size="small"
                        label="Body"
                        placeholder="Enter body content"
                        multiline
                        rowsMax={20}
                        value={response.body}
                        onChange={handleBodyChange}
                        className={classes.bodyField}
                    />
                </FormGroup>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

Response.propTypes = {
    response: PropTypes.object.isRequired,
    ruleId: PropTypes.string.isRequired,
    warnings: PropTypes.object.isRequired,
    onModifyResponse: PropTypes.func.isRequired
};

export default Response;
