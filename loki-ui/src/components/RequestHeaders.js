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
import { deleteWarnings, shiftIndexedWarnings, validators } from '../warnings';

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
    const {headers, headersExpanded, ruleId, warnings, onModifyRequest} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyRequest({headersExpanded: expanded});
    };

    const handleAddHeader = () => {
        const header = defaultHeaderWithConditions();

        const warningsCopy = {...warnings};
        validators.headerKey(header.key, ruleId, 'request', headers.length, warningsCopy);
        validators.headerValue(header.value, ruleId, 'request', headers.length, warningsCopy);

        onModifyRequest({headers: [...headers, header]}, warningsCopy);
    };

    const handleDeleteHeader = index => {
        const headersCopy = [...headers];
        headersCopy.splice(index, 1);

        let warningsCopy = {...warnings};
        deleteWarnings(`${ruleId}-request-header-${index}`, warningsCopy);
        warningsCopy = shiftIndexedWarnings('request-header', index, warningsCopy);

        onModifyRequest({headers: headersCopy}, warningsCopy);
    };

    const handleHeaderKeyChange = (index, key) => {
        const headersCopy = [...headers];
        headersCopy[index] = {...headersCopy[index], key: key};

        const warningsCopy = {...warnings};
        validators.headerKey(key, ruleId, 'request', index, warningsCopy);

        onModifyRequest({headers: headersCopy}, warningsCopy);
    };

    const handleHeaderValueChange = (index, value) => {
        const headersCopy = [...headers];
        headersCopy[index] = {...headersCopy[index], value: value};

        const warningsCopy = {...warnings};
        validators.headerValue(value, ruleId, 'request', index, warningsCopy);

        onModifyRequest({headers: headersCopy}, warningsCopy);
    };

    const handleHeaderValueIgnoreCaseChange = (index, ignoreCase) => {
        const headersCopy = [...headers];
        headersCopy[index] = {...headersCopy[index], valueIgnoreCase: ignoreCase};

        onModifyRequest({headers: headersCopy});
    };

    const handleHeaderConditionChange = (index, condition) => {
        const headersCopy = [...headers];
        headersCopy[index] = {...headersCopy[index], condition: condition};

        const warningsCopy = {...warnings};
        if (!headers[index].condition.includes('PRESENT') && condition.includes('PRESENT')) {
            deleteWarnings(`${ruleId}-request-header-${index}-value`, warningsCopy);
        } else if (headers[index].condition.includes('PRESENT') && !condition.includes('PRESENT')) {
            validators.headerValue(headersCopy[index].value, ruleId, 'request', index, warningsCopy);
        }

        onModifyRequest({headers: headersCopy}, warningsCopy);
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
                                     ruleId={ruleId}
                                     warnings={warnings}
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
    ruleId: PropTypes.string.isRequired,
    warnings: PropTypes.object.isRequired,
    onModifyRequest: PropTypes.func.isRequired
};

export default RequestHeaders;
