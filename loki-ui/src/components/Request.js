import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import RequestHeaders from './RequestHeaders';
import RequestParameters from './RequestParameters';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { deleteWarnings, validators } from '../warnings';
import FormLabel from '@material-ui/core/FormLabel';

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
    },
    warning: {
        color: 'red',
        fontWeight: 'bold'
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
    const showBodyField = !request.bodyCondition.includes('PRESENT');

    return (
        <ExpansionPanel square expanded={request.expanded} onChange={handleStateChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography className={headingClass}>Request</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <FormGroup row className={classes.fields}>
                    <TextField
                        error={!!warnings[`${ruleId}-request-method`]}
                        helperText={warnings[`${ruleId}-request-method`]}
                        variant="outlined"
                        size="small"
                        label="HTTP method"
                        placeholder="Enter HTTP method"
                        value={request.method}
                        onChange={handleMethodChange}
                        className={classes.field}
                    />
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        value={request.methodCondition}
                        onChange={handleMethodConditionChange}
                        className={classes.select}
                    >
                        <MenuItem value="EQUAL">EQUAL</MenuItem>
                        <MenuItem value="NOT_EQUAL">NOT EQUAL</MenuItem>
                    </TextField>
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
                    {!showBodyField && <FormLabel>Body</FormLabel>}
                    {showBodyField &&
                     <TextField
                         error={!!warnings[`${ruleId}-request-body`]}
                         helperText={warnings[`${ruleId}-request-body`]}
                         variant="outlined"
                         size="small"
                         label="Body"
                         placeholder="Enter body content"
                         multiline
                         rowsMax={20}
                         value={request.body}
                         onChange={handleBodyChange}
                         className={classes.field}
                     />}
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        value={request.bodyCondition}
                        onChange={handleBodyConditionChange}
                        className={classes.select}
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
