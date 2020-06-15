import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import RequestHeaders from './RequestHeaders';
import RequestParameters from './RequestParameters';
import RequestUrlVariables from './RequestUrlVariables';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { ignoreEvent } from '../util';
import { deleteWarnings, validators } from '../warnings';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'block',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    methodLabel: {
        marginTop: theme.spacing(2.66),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    methodCondition: {
        margin: theme.spacing(1),
        width: 140
    },
    methodField: {
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
    bodyLabel: {
        marginTop: theme.spacing(2.66),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    bodyCondition: {
        margin: theme.spacing(1),
        width: 168
    },
    bodyCheckbox: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(0.25),
    },
    bodyField: {
        flexGrow: 1,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    bodyFieldOffset: {
        flexGrow: 1,
        marginTop: theme.spacing(1),
        marginBottom: 1,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    warning: {
        color: 'red',
        fontWeight: 'bold'
    }
}));

function Request(props) {
    const {request, ruleId, warnings, onModifyRequest} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyRequest({expanded: expanded});
    };

    const handleMethodChange = event => {
        const method = event.target.value.trim().toUpperCase();

        if (method !== request.method) {
            const warningsCopy = {...warnings};
            validators.httpMethod(method, ruleId, warningsCopy);

            onModifyRequest({method: method}, warningsCopy);
        }
    };

    const handleMethodConditionChange = event => {
        const condition = event.target.value;

        onModifyRequest({methodCondition: condition});
    };

    const handleBodyChange = event => {
        const body = event.target.value;

        if (body !== request.body) {
            const warningsCopy = {...warnings};
            validators.body(body, ruleId, warningsCopy);

            onModifyRequest({body: body}, warningsCopy);
        }
    };

    const handleBodyConditionChange = event => {
        const condition = event.target.value;

        const warningsCopy = {...warnings};
        if (!request.bodyCondition.includes('PRESENT') && condition.includes('PRESENT')) {
            deleteWarnings(`${ruleId}-request-body`, warningsCopy);
        } else if (request.bodyCondition.includes('PRESENT') && !condition.includes('PRESENT')) {
            validators.body(request.body, ruleId, warningsCopy);
        }

        onModifyRequest({bodyCondition: condition}, warningsCopy);
    };

    const handleBodyIgnoreCaseChange = event => {
        const ignoreCase = event.target.checked;

        onModifyRequest({bodyIgnoreCase: ignoreCase});
    };

    const handleBodyIgnoreWhitespaceChange = event => {
        const ignoreWhitespace = event.target.checked;

        onModifyRequest({bodyIgnoreWhitespace: ignoreWhitespace});
    };

    const hasWarnings = Object.keys(warnings).filter(id => id.startsWith(`${ruleId}-request`)).length > 0;
    const headingClass = hasWarnings ? classes.warning : null;
    const methodWarning = warnings[`${ruleId}-request-method`];
    const panelsClass = clsx(!methodWarning && classes.panels, !!methodWarning && classes.panelsOffset);
    const showBodyField = !request.bodyCondition.includes('PRESENT');
    const bodyWarning = warnings[`${ruleId}-request-body`];
    const bodyFieldClass = clsx(!bodyWarning && classes.bodyField, !!bodyWarning && classes.bodyFieldOffset);

    return (
        <ExpansionPanel square expanded={request.expanded} onChange={handleStateChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography className={headingClass}>Request</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <FormGroup row>
                    <FormLabel className={classes.methodLabel}>HTTP Method</FormLabel>
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        value={request.methodCondition}
                        onChange={handleMethodConditionChange}
                        className={classes.methodCondition}
                    >
                        <MenuItem value="EQUAL">EQUAL</MenuItem>
                        <MenuItem value="NOT_EQUAL">NOT EQUAL</MenuItem>
                    </TextField>
                    <TextField
                        error={!!methodWarning}
                        helperText={methodWarning}
                        variant="outlined"
                        size="small"
                        label="HTTP method"
                        placeholder="Enter HTTP method"
                        value={request.method}
                        onChange={handleMethodChange}
                        className={classes.methodField}
                    />
                </FormGroup>
                <div className={panelsClass}>
                    <RequestUrlVariables
                        variables={request.urlVariables}
                        variablesExpanded={request.urlVariablesExpanded}
                        ruleId={ruleId}
                        warnings={warnings}
                        onModifyRequest={onModifyRequest}
                    />
                    <RequestParameters
                        parameters={request.parameters}
                        parametersExpanded={request.parametersExpanded}
                        ruleId={ruleId}
                        warnings={warnings}
                        onModifyRequest={onModifyRequest}
                    />
                    <RequestHeaders
                        headers={request.headers}
                        headersExpanded={request.headersExpanded}
                        ruleId={ruleId}
                        warnings={warnings}
                        onModifyRequest={onModifyRequest}
                    />
                </div>
                <FormGroup row>
                    <FormLabel className={classes.bodyLabel}>Body</FormLabel>
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        value={request.bodyCondition}
                        onChange={handleBodyConditionChange}
                        className={classes.bodyCondition}
                    >
                        <MenuItem value="PRESENT">PRESENT</MenuItem>
                        <MenuItem value="NOT_PRESENT">NOT PRESENT</MenuItem>
                        <MenuItem value="EQUAL">EQUAL</MenuItem>
                        <MenuItem value="NOT_EQUAL">NOT EQUAL</MenuItem>
                        <MenuItem value="CONTAINS">CONTAINS</MenuItem>
                        <MenuItem value="NOT_CONTAINS">NOT CONTAINS</MenuItem>
                    </TextField>
                    <FormControlLabel
                        onClick={ignoreEvent}
                        onFocus={ignoreEvent}
                        control={<Checkbox checked={request.bodyIgnoreCase} onChange={handleBodyIgnoreCaseChange}/>}
                        label="ignore case"
                        className={classes.bodyCheckbox}
                    />
                    <FormControlLabel
                        onClick={ignoreEvent}
                        onFocus={ignoreEvent}
                        control={<Checkbox checked={request.bodyIgnoreWhitespace} onChange={handleBodyIgnoreWhitespaceChange}/>}
                        label="ignore whitespace"
                        className={classes.bodyCheckbox}
                    />
                </FormGroup>
                {showBodyField &&
                 <FormGroup row>
                     <TextField
                         error={!!bodyWarning}
                         helperText={bodyWarning}
                         variant="outlined"
                         size="small"
                         label="Body"
                         placeholder="Enter body content"
                         multiline
                         rowsMax={20}
                         value={request.body}
                         onChange={handleBodyChange}
                         className={bodyFieldClass}
                     />
                 </FormGroup>}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

Request.propTypes = {
    request: PropTypes.object.isRequired,
    ruleId: PropTypes.string.isRequired,
    warnings: PropTypes.object.isRequired,
    onModifyRequest: PropTypes.func.isRequired
};

export default Request;
