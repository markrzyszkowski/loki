import React from 'react';
import { Add, Delete, ExpandMore } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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

function Response(props) {
    const {response, onModifyResponse} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyResponse({expanded: expanded});
    };

    const handleHeadersStateChange = (_, expanded) => {
        onModifyResponse({headersExpanded: expanded});
    };

    const handleStatusCodeChange = event => {
        const statusCode = parseInt(event.target.value);

        // validate

        onModifyResponse({statusCode: statusCode});
    };

    const handleAddHeader = () => {
        onModifyResponse({headers: [...response.headers, {key: '', value: ''}]});
    };

    const handleHeaderKeyChange = (event, index) => {
        const headersCopy = [...response.headers];
        headersCopy[index] = {...headersCopy[index], key: event.target.value};

        onModifyResponse({headers: headersCopy});
    };

    const handleHeaderValueChange = (event, index) => {
        const headersCopy = [...response.headers];
        headersCopy[index] = {...headersCopy[index], value: event.target.value};

        onModifyResponse({headers: headersCopy});
    };

    const handleDeleteHeader = index => {
        const headersCopy = [...response.headers];
        headersCopy.splice(index, 1);

        onModifyResponse({headers: headersCopy});
    };

    const handleBodyChange = event => {
        const body = event.target.value;

        onModifyResponse({body: body});
    };

    return (
        <ExpansionPanel square expanded={response.expanded} onChange={handleStateChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography>Response</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.wrapper}>
                <FormGroup row className={classes.fields}>
                    <TextField
                        label="Status code"
                        placeholder="Enter status code"
                        value={response.statusCode}
                        type="number"
                        inputProps={{min: 100, max: 599}}
                        onChange={handleStatusCodeChange}
                        // className={clsx(classes.field, classes.urlField)}
                        fullWidth
                    />
                </FormGroup>
                <div className={classes.headersWrapper}>
                    {!response.headers.length &&
                     <Button
                         variant="contained"
                         color="secondary"
                         startIcon={<Add/>}
                         onClick={handleAddHeader}
                     >
                         Add header
                     </Button>}
                    <div className={classes.headers}>
                        {!!response.headers.length &&
                         <ExpansionPanel square expanded={response.headersExpanded} onChange={handleHeadersStateChange}>
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
                                     {response.headers.map((header, index) =>
                                         <FormGroup row>
                                             <TextField
                                                 label="Key"
                                                 value={response.headers[index].key}
                                                 onChange={event => handleHeaderKeyChange(event, index)}
                                                 fullWidth
                                             />
                                             <TextField
                                                 label="Value"
                                                 value={response.headers[index].value}
                                                 onChange={event => handleHeaderValueChange(event, index)}
                                                 fullWidth
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
                <TextField
                    label="Body"
                    placeholder="Body content goes here"
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
    onModifyResponse: PropTypes.func.isRequired
};

export default Response;
