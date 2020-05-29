import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import ResponseHeaders from './ResponseHeaders';
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

    return (
        <ExpansionPanel square expanded={response.expanded} onChange={handleStateChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography>Response</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <FormGroup row className={classes.fields}>
                    <TextField
                        error={!!warnings[`${ruleId}-response-statusCode`]}
                        helperText={warnings[`${ruleId}-response-statusCode`]}
                        label="Status code"
                        placeholder="Enter status code"
                        value={response.statusCode}
                        type="number"
                        inputProps={{min: 100, max: 599}}
                        onChange={handleStatusCodeChange}
                        fullWidth
                    />
                </FormGroup>
                <ResponseHeaders
                    headers={response.headers}
                    headersExpanded={response.headersExpanded}
                    ruleId={ruleId}
                    warnings={warnings}
                    onModifyResponse={onModifyResponse}
                />
                <TextField
                    error={!!warnings[`${ruleId}-response-body`]}
                    helperText={warnings[`${ruleId}-response-body`]}
                    label="Body"
                    placeholder="Enter body content"
                    multiline
                    rowsMax={20}
                    value={response.body}
                    onChange={handleBodyChange}
                    fullWidth
                />
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
