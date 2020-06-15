import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import ResponseHeaders from './ResponseHeaders';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { deleteWarnings, validators } from '../warnings';
import { ignoreEvent } from '../util';

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
    switch: {
        alignSelf: 'start',
        marginTop: theme.spacing(1.15),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(0.25)
    },
    delayField: {
        margin: theme.spacing(1),
        width: 168
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

    const handleDelayChange = event => {
        const delay = event.target.value.trim();

        if (delay !== response.delay) {
            const warningsCopy = {...warnings};
            validators.delay(delay, ruleId, warningsCopy);

            onModifyResponse({delay: delay}, warningsCopy);
        }
    };

    const handleDelayResponseChange = event => {
        const delayResponse = event.target.checked;

        const warningsCopy = {...warnings};
        if (response.delayResponse && !delayResponse) {
            deleteWarnings(`${ruleId}-response-delay`, warningsCopy);
        } else if (!response.delayResponse && delayResponse) {
            validators.delay(response.delay.toString(), ruleId, warningsCopy);
        }

        onModifyResponse({delayResponse: delayResponse}, warningsCopy);
    };

    const hasWarnings = Object.keys(warnings).filter(id => id.startsWith(`${ruleId}-response`)).length > 0;
    const headingClass = hasWarnings ? classes.warning : null;
    const statusCodeWarning = warnings[`${ruleId}-response-statusCode`];
    const delayWarning = warnings[`${ruleId}-response-delay`];
    const panelsClass = clsx(!statusCodeWarning && !delayWarning && classes.panels, (!!statusCodeWarning || !!delayWarning) && classes.panelsOffset);
    const showDelayField = response.delayResponse;

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
                    <FormControlLabel
                        onClick={ignoreEvent}
                        onFocus={ignoreEvent}
                        control={<Switch checked={response.delayResponse} onChange={handleDelayResponseChange}/>}
                        label="delay response"
                        className={classes.switch}
                    />
                    {showDelayField &&
                     <TextField
                         error={!!delayWarning}
                         helperText={delayWarning}
                         variant="outlined"
                         size="small"
                         label="Delay"
                         placeholder="Enter delay"
                         value={response.delay}
                         type="number"
                         inputProps={{min: 0, max: 300000, step: 100}}
                         InputProps={{endAdornment: <InputAdornment position="end">ms</InputAdornment>}}
                         onChange={handleDelayChange}
                         className={classes.delayField}
                     />}
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
