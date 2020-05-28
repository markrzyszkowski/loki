import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import RequestHeaders from './RequestHeaders';
import RequestParameters from './RequestParameters';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { validators } from '../warnings';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    fields: {
        width: '100%'
    },
    field: {
        flexGrow: 1,
        margin: theme.spacing(1)
    },
    select: {
        margin: theme.spacing(1)
    }
}));

function Request(props) {
    const {request, ruleId, warnings, onModifyRequest} = props;

    const classes = useStyles();

    const ignoreEvent = event => {
        event.stopPropagation();
    };

    const handleStateChange = (_, expanded) => {
        onModifyRequest({expanded: expanded});
    };

    const handleMethodChange = event => {
        const method = event.target.value.trim().toUpperCase();

        if (method !== request.method) {
            validators.httpMethod(method, ruleId, warnings);

            onModifyRequest({method: method}, warnings);
        }
    };

    const handleMethodConditionChange = event => {
        const condition = event.target.value;

        onModifyRequest({methodCondition: condition});
    };

    const handleBodyChange = event => {
        const body = event.target.value;

        if (body !== request.body) {
            validators.body(body, ruleId, 'request', warnings);

            onModifyRequest({body: body}, warnings);
        }
    };

    const handleBodyConditionChange = event => {
        const condition = event.target.value;

        // TODO validate

        onModifyRequest({bodyCondition: condition});
    };

    const handleBodyIgnoreCaseChange = event => {
        const ignoreCase = event.target.checked;

        onModifyRequest({bodyIgnoreCase: ignoreCase});
    };

    const handleBodyIgnoreWhitespaceChange = event => {
        const ignoreWhitespace = event.target.checked;

        onModifyRequest({bodyIgnoreWhitespace: ignoreWhitespace});
    };

    return (
        <ExpansionPanel square expanded={request.expanded} onChange={handleStateChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography>Request</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <FormGroup row className={classes.fields}>
                    <TextField
                        error={!!warnings[`${ruleId}-request-method`]}
                        helperText={warnings[`${ruleId}-request-method`]}
                        label="HTTP method"
                        size="small"
                        placeholder="Enter HTTP method"
                        value={request.method}
                        onChange={handleMethodChange}
                        className={classes.field}
                    />
                    <Select value={request.methodCondition} onChange={handleMethodConditionChange} className={classes.select}>
                        <MenuItem value='EQUAL'>EQUAL</MenuItem>
                        <MenuItem value='NOT_EQUAL'>NOT EQUAL</MenuItem>
                    </Select>
                </FormGroup>
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
                <FormGroup row className={classes.fields}>
                    <TextField
                        error={!!warnings[`${ruleId}-request-body`]}
                        helperText={warnings[`${ruleId}-request-body`]}
                        label="Body"
                        size="small"
                        placeholder="Enter body content"
                        multiline
                        rowsMax={20}
                        value={request.body}
                        onChange={handleBodyChange}
                        className={classes.field}
                    />
                    <Select value={request.bodyCondition} onChange={handleBodyConditionChange} className={classes.select}>
                        <MenuItem value='PRESENT'>PRESENT</MenuItem>
                        <MenuItem value='NOT_PRESENT'>NOT PRESENT</MenuItem>
                        <MenuItem value='EQUAL'>EQUAL</MenuItem>
                        <MenuItem value='NOT_EQUAL'>NOT EQUAL</MenuItem>
                        <MenuItem value='CONTAINS'>CONTAINS</MenuItem>
                        <MenuItem value='NOT_CONTAINS'>NOT CONTAINS</MenuItem>
                    </Select>
                    <FormControlLabel
                        onClick={ignoreEvent}
                        onFocus={ignoreEvent}
                        control={<Checkbox checked={request.bodyIgnoreCase} onChange={handleBodyIgnoreCaseChange}/>}
                        label="ignore case"
                    />
                    <FormControlLabel
                        onClick={ignoreEvent}
                        onFocus={ignoreEvent}
                        control={<Checkbox checked={request.bodyIgnoreWhitespace} onChange={handleBodyIgnoreWhitespaceChange}/>}
                        label="ignore whitespace"
                    />
                </FormGroup>
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
