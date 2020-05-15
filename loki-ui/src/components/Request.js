import React from 'react';
import { Add, Delete, ExpandMore } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from './CustomExpansionPanelSummary';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'block',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    grow: {
        flexGrow: 1
    },
    fields: {
        width: '100%'
    },
    headersWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    headers: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

function Request(props) {
    const {request, onModifyRequest} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyRequest({expanded: expanded});
    };

    const handleHeadersStateChange = (_, expanded) => {
        onModifyRequest({headersExpanded: expanded});
    };

    const handleParametersStateChange = (_, expanded) => {
        onModifyRequest({parametersExpanded: expanded});
    };

    const handleMethodChange = event => {
        const method = event.target.value;

        onModifyRequest({method: method});
    };

    const handleMethodConditionChange = event => {
        const methodCondition = event.target.value;

        onModifyRequest({methodCondition: methodCondition});
    };

    const handleAddHeader = () => {
        onModifyRequest({headers: [...request.headers, {key: '', value: '', condition: '', keyIgnoreCase: false, valueIgnoreCase: false}]});
    };

    const handleHeaderKeyChange = (event, index) => {
        const headersCopy = [...request.headers];
        headersCopy[index] = {...headersCopy[index], key: event.target.value};

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderKeyIgnoreCaseChange = (event, index) => {
        const headersCopy = [...request.headers];
        headersCopy[index] = {...headersCopy[index], keyIgnoreCase: event.target.checked};

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderValueChange = (event, index) => {
        const headersCopy = [...request.headers];
        headersCopy[index] = {...headersCopy[index], value: event.target.value};

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderValueIgnoreCaseChange = (event, index) => {
        const headersCopy = [...request.headers];
        headersCopy[index] = {...headersCopy[index], valueIgnoreCase: event.target.checked};

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderConditionChange = (event, index) => {
        const headersCopy = [...request.headers];
        headersCopy[index] = {...headersCopy[index], condition: event.target.value};

        onModifyRequest({headers: headersCopy});
    };

    const handleDeleteHeader = index => {
        const headersCopy = [...request.headers];
        headersCopy.splice(index, 1);

        onModifyRequest({headers: headersCopy});
    };

    const handleAddParameter = () => {
        onModifyRequest({parameters: [...request.parameters, {key: '', value: '', condition: '', keyIgnoreCase: false, valueIgnoreCase: false}]});
    };

    const handleParameterKeyChange = (event, index) => {
        const parametersCopy = [...request.parameters];
        parametersCopy[index] = {...parametersCopy[index], key: event.target.value};

        onModifyRequest({parameters: parametersCopy});
    };

    const handleParameterKeyIgnoreCaseChange = (event, index) => {
        const parametersCopy = [...request.parameters];
        parametersCopy[index] = {...parametersCopy[index], keyIgnoreCase: event.target.checked};

        onModifyRequest({parameters: parametersCopy});
    };

    const handleParameterValueChange = (event, index) => {
        const parametersCopy = [...request.parameters];
        parametersCopy[index] = {...parametersCopy[index], value: event.target.value};

        onModifyRequest({parameters: parametersCopy});
    };

    const handleParameterValueIgnoreCaseChange = (event, index) => {
        const parametersCopy = [...request.parameters];
        parametersCopy[index] = {...parametersCopy[index], valueIgnoreCase: event.target.checked};

        onModifyRequest({parameters: parametersCopy});
    };

    const handleDeleteParameter = index => {
        const parametersCopy = [...request.parameters];
        parametersCopy.splice(index, 1);

        onModifyRequest({parameters: parametersCopy});
    };

    const handleParameterConditionChange = (event, index) => {
        const parametersCopy = [...request.parameters];
        parametersCopy[index] = {...parametersCopy[index], condition: event.target.value};

        onModifyRequest({headers: parametersCopy});
    };

    const handleBodyChange = event => {
        const body = event.target.value;

        onModifyRequest({body: body});
    };

    const handleBodyConditionChange = event => {
        const bodyCondition = event.target.value;

        onModifyRequest({bodyCondition: bodyCondition});
    };

    const handleBodyIgnoreCaseChange = event => {
        const bodyIgnoreCase = event.target.checked;

        onModifyRequest({bodyIgnoreCase: bodyIgnoreCase});
    };

    const handleBodyIgnoreWhitespaceChange = event => {
        const bodyIgnoreWhitespace = event.target.checked;

        onModifyRequest({bodyIgnoreWhitespace: bodyIgnoreWhitespace});
    };

    return (
        <ExpansionPanel square expanded={request.expanded} onChange={handleStateChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography>Request</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.wrapper}>
                <FormGroup row className={classes.fields}>
                    <TextField
                        label="Method"
                        placeholder="Enter method"
                        value={request.method}
                        onChange={handleMethodChange}
                        // className={clsx(classes.field, classes.urlField)}
                        fullWidth
                    />
                    <Select
                        value={request.methodCondition}
                        onChange={handleMethodConditionChange}
                    >
                        <MenuItem value='EQUAL'>EQUAL</MenuItem>
                        <MenuItem value='NOT_EQUAL'>NOT EQUAL</MenuItem>
                    </Select>
                </FormGroup>
                <div className={classes.headersWrapper}>
                    {!request.parameters.length &&
                     <Button
                         variant="contained"
                         color="secondary"
                         startIcon={<Add/>}
                         onClick={handleAddParameter}
                     >
                         Add parameter
                     </Button>}
                    <div className={classes.headers}>
                        {!!request.parameters.length &&
                         <ExpansionPanel square expanded={request.parametersExpanded} onChange={handleParametersStateChange}>
                             <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                                 <Typography>Parameters</Typography>
                             </ExpansionPanelSummary>
                             <ExpansionPanelDetails>
                                 <div className={classes.headersWrapper}>
                                     <Button
                                         variant="contained"
                                         color="secondary"
                                         startIcon={<Add/>}
                                         onClick={handleAddParameter}
                                     >
                                         Add parameter
                                     </Button>
                                     {request.parameters.map((parameter, index) =>
                                         <FormGroup row>
                                             <TextField
                                                 label="Key"
                                                 value={parameter.key}
                                                 onChange={event => handleParameterKeyChange(event, index)}
                                                 fullWidth
                                             />
                                             <FormControlLabel
                                                 control={<Checkbox checked={parameter.keyIgnoreCase} onChange={handleParameterKeyIgnoreCaseChange}/>}
                                                 label="ignore case"
                                             />
                                             <Select
                                                 value={parameter.condition}
                                                 onChange={event => handleParameterConditionChange(event, index)}
                                             >
                                                 <MenuItem value='PRESENT'>PRESENT</MenuItem>
                                                 <MenuItem value='NOT PRESENT'>NOT PRESENT</MenuItem>
                                                 <MenuItem value='EQUAL'>EQUAL</MenuItem>
                                                 <MenuItem value='NOT EQUAL'>NOT EQUAL</MenuItem>
                                                 <MenuItem value='CONTAINS'>CONTAINS</MenuItem>
                                                 <MenuItem value='NOT CONTAINS'>NOT CONTAINS</MenuItem>
                                             </Select>
                                             <TextField
                                                 label="Value"
                                                 value={parameter.value}
                                                 onChange={event => handleParameterValueChange(event, index)}
                                                 fullWidth
                                             />
                                             <FormControlLabel
                                                 control={<Checkbox checked={parameter.valueIgnoreCase} onChange={handleParameterValueIgnoreCaseChange}/>}
                                                 label="ignore case"
                                             />
                                             <IconButton size="small" onClick={() => handleDeleteParameter(index)}>
                                                 <Delete/>
                                             </IconButton>
                                         </FormGroup>
                                     )}
                                 </div>
                             </ExpansionPanelDetails>
                         </ExpansionPanel>}
                    </div>
                </div>
                <div className={classes.headersWrapper}>
                    {!request.headers.length &&
                     <Button
                         variant="contained"
                         color="secondary"
                         startIcon={<Add/>}
                         onClick={handleAddHeader}
                     >
                         Add header
                     </Button>}
                    <div className={classes.headers}>
                        {!!request.headers.length &&
                         <ExpansionPanel square expanded={request.headersExpanded} onChange={handleHeadersStateChange}>
                             <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                                 <Typography>Headers</Typography>
                             </ExpansionPanelSummary>
                             <ExpansionPanelDetails>
                                 <div className={classes.headersWrapper}>
                                     <Button
                                         variant="contained"
                                         color="secondary"
                                         startIcon={<Add/>}
                                         onClick={handleAddHeader}
                                     >
                                         Add header
                                     </Button>
                                     {request.headers.map((header, index) =>
                                         <FormGroup row>
                                             <TextField
                                                 label="Key"
                                                 value={header.key}
                                                 onChange={event => handleHeaderKeyChange(event, index)}
                                                 fullWidth
                                             />
                                             <FormControlLabel
                                                 control={<Checkbox checked={header.keyIgnoreCase} onChange={handleHeaderKeyIgnoreCaseChange}/>}
                                                 label="ignore case"
                                             />
                                             <Select
                                                 value={header.condition}
                                                 onChange={event => handleHeaderConditionChange(event, index)}
                                             >
                                                 <MenuItem value='PRESENT'>PRESENT</MenuItem>
                                                 <MenuItem value='NOT_PRESENT'>NOT PRESENT</MenuItem>
                                                 <MenuItem value='EQUAL'>EQUAL</MenuItem>
                                                 <MenuItem value='NOT_EQUAL'>NOT EQUAL</MenuItem>
                                                 <MenuItem value='CONTAINS'>CONTAINS</MenuItem>
                                                 <MenuItem value='NOT_CONTAINS'>NOT CONTAINS</MenuItem>
                                             </Select>
                                             <TextField
                                                 label="Value"
                                                 value={header.value}
                                                 onChange={event => handleHeaderValueChange(event, index)}
                                                 fullWidth
                                             />
                                             <FormControlLabel
                                                 control={<Checkbox checked={header.valueIgnoreCase} onChange={handleHeaderValueIgnoreCaseChange}/>}
                                                 label="ignore case"
                                             />
                                             <IconButton size="small" onClick={() => handleDeleteHeader(index)}>
                                                 <Delete/>
                                             </IconButton>
                                         </FormGroup>
                                     )}
                                 </div>
                             </ExpansionPanelDetails>
                         </ExpansionPanel>}
                    </div>
                </div>
                <FormGroup row>
                    <TextField
                        label="Body"
                        placeholder="Body content goes here"
                        multiline
                        rowsMax={20}
                        value={request.body}
                        onChange={handleBodyChange}
                        fullWidth
                    />
                    <Select
                        value={request.bodyCondition}
                        onChange={handleBodyConditionChange}
                    >
                        <MenuItem value='PRESENT'>PRESENT</MenuItem>
                        <MenuItem value='NOT_PRESENT'>NOT PRESENT</MenuItem>
                        <MenuItem value='EQUAL'>EQUAL</MenuItem>
                        <MenuItem value='NOT_EQUAL'>NOT EQUAL</MenuItem>
                        <MenuItem value='CONTAINS'>CONTAINS</MenuItem>
                        <MenuItem value='NOT_CONTAINS'>NOT CONTAINS</MenuItem>
                    </Select>
                    <FormControlLabel
                        control={<Checkbox checked={request.bodyIgnoreCase} onChange={handleBodyIgnoreCaseChange}/>}
                        label="ignore case"
                    />
                    <FormControlLabel
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
    onModifyRequest: PropTypes.func.isRequired
};

export default Request;
