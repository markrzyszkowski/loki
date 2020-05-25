import React from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Add, ExpandMore } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import RequestHeader from './RequestHeader';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { defaultHeaderWithConditions } from '../defaults';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    contentOffset: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: '2px',
        marginBottom: theme.spacing(3)
    },
    fullWidth: {
        width: '100%'
    },
    headers: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(0)
    },
    button: {
        marginBottom: theme.spacing(2)
    }
}));

function RequestHeaders(props) {
    const {headers, headersExpanded, onModifyRequest} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyRequest({headersExpanded: expanded});
    };

    const handleAddHeader = () => {
        onModifyRequest({headers: [...headers, defaultHeaderWithConditions()]});

        // validate
    };

    const handleDeleteHeader = index => {
        const headersCopy = [...headers];
        headersCopy.splice(index, 1);

        // validate

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderKeyChange = (index, key) => {
        const headersCopy = [...headers];
        headersCopy[index] = {...headersCopy[index], key: key};

        // validate

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderValueChange = (index, value) => {
        const headersCopy = [...headers];
        headersCopy[index] = {...headersCopy[index], value: value};

        // validate

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderValueIgnoreCaseChange = (index, ignoreCase) => {
        const headersCopy = [...headers];
        headersCopy[index] = {...headersCopy[index], valueIgnoreCase: ignoreCase};

        // validate

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderConditionChange = (index, condition) => {
        const headersCopy = [...headers];
        headersCopy[index] = {...headersCopy[index], condition: condition};

        // validate

        onModifyRequest({headers: headersCopy});
    };

    const contentClass = classes.content;
    const hasHeaders = headers.length > 0;

    return (
        <div className={contentClass}>
            {!hasHeaders &&
             <Button
                 variant="contained"
                 color="secondary"
                 startIcon={<Add/>}
                 onClick={handleAddHeader}
             >
                 Add header
             </Button>}
             {hasHeaders &&
             <div className={classes.fullWidth}>
                 <ExpansionPanel square expanded={headersExpanded} onChange={handleStateChange}>
                     <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                         <Typography>Headers</Typography>
                     </ExpansionPanelSummary>
                     <ExpansionPanelDetails>
                         <div className={classes.headers}>
                             <Button
                                 variant="contained"
                                 color="secondary"
                                 startIcon={<Add/>}
                                 onClick={handleAddHeader}
                                 className={classes.button}
                             >
                                 Add header
                             </Button>
                             {headers.map((header, index) =>
                                 <RequestHeader
                                     header={header}
                                     index={index}
                                     onDeleteHeader={handleDeleteHeader}
                                     onKeyChange={handleHeaderKeyChange}
                                     onValueChange={handleHeaderValueChange}
                                     onValueIgnoreCaseChange={handleHeaderValueIgnoreCaseChange}
                                     onConditionChange={handleHeaderConditionChange}
                                 />
                             )}
                         </div>
                     </ExpansionPanelDetails>
                 </ExpansionPanel>
             </div>}
        </div>
    );
}

RequestHeaders.propTypes = {
    headers: PropTypes.array.isRequired,
    headersExpanded: PropTypes.bool.isRequired,
    onModifyRequest: PropTypes.func.isRequired
};

export default RequestHeaders;
