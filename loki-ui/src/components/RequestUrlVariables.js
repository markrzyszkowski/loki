import React from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Add, ExpandMore } from '@material-ui/icons';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import RequestUrlVariable from './RequestUrlVariable';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { defaultUrlVariable } from '../defaults';
import { deleteWarnings, shiftIndexedWarnings, validators } from '../warnings';

const useStyles = makeStyles(theme => ({
    variables: {
        display: 'block',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    center: {
        display: 'flex',
        justifyContent: 'center'
    },
    button: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    buttonOffset: {
        marginTop: 5,
        marginBottom: theme.spacing(3)
    },
    warning: {
        color: 'red',
        fontWeight: 'bold'
    }
}));

function RequestUrlVariables(props) {
    const {variables, variablesExpanded, ruleId, warnings, onModifyRequest} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyRequest({urlVariablesExpanded: expanded});
    };

    const handleAddVariable = () => {
        const variable = defaultUrlVariable();

        const warningsCopy = {...warnings};
        validators.urlVariableKey(variable.key, ruleId, variables.length, warningsCopy);
        validators.urlVariableValue(variable.value, ruleId, variables.length, warningsCopy);

        onModifyRequest({urlVariables: [...variables, variable]}, warningsCopy);
    };

    const handleDeleteVariable = index => {
        const variablesCopy = [...variables];
        variablesCopy.splice(index, 1);

        let warningsCopy = {...warnings};
        deleteWarnings(`${ruleId}-request-variable-${index}`, warningsCopy);
        warningsCopy = shiftIndexedWarnings(`${ruleId}-request-variable`, index, warningsCopy);

        onModifyRequest({urlVariables: variablesCopy}, warningsCopy);
    };

    const handleVariableKeyChange = (index, key) => {
        const variablesCopy = [...variables];
        variablesCopy[index] = {...variablesCopy[index], key: key};

        const warningsCopy = {...warnings};
        validators.urlVariableKey(key, ruleId, index, warningsCopy);

        onModifyRequest({urlVariables: variablesCopy}, warningsCopy);
    };

    const handleVariableValueChange = (index, value) => {
        const variablesCopy = [...variables];
        variablesCopy[index] = {...variablesCopy[index], value: value};

        const warningsCopy = {...warnings};
        validators.urlVariableValue(value, ruleId, index, warningsCopy);

        onModifyRequest({urlVariables: variablesCopy}, warningsCopy);
    };

    const hasVariables = variables.length > 0;
    const hasWarnings = hasVariables
                        && Object.keys(warnings).filter(id => id.startsWith(`${ruleId}-request-variable`)).length > 0;
    const headingClass = hasWarnings ? classes.warning : null;
    const shouldOffsetButton = !!warnings[`${ruleId}-request-variable-${variables.length - 1}-key`]
                               || !!warnings[`${ruleId}-request-variable-${variables.length - 1}-value`];
    const buttonClass = clsx(!shouldOffsetButton && classes.button, shouldOffsetButton && classes.buttonOffset);

    return (
        <ExpansionPanel square expanded={variablesExpanded} onChange={handleStateChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                <Typography className={headingClass}>URL variables</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.variables}>
                {variables.map((variable, index) =>
                    <RequestUrlVariable
                        key={index}
                        variable={variable}
                        index={index}
                        ruleId={ruleId}
                        warnings={warnings}
                        onDeleteVariable={handleDeleteVariable}
                        onKeyChange={handleVariableKeyChange}
                        onValueChange={handleVariableValueChange}
                    />
                )}
                <div className={classes.center}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Add/>}
                        onClick={handleAddVariable}
                        className={buttonClass}
                    >
                        Add URL variable
                    </Button>
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

RequestUrlVariables.propTypes = {
    variables: PropTypes.array.isRequired,
    variablesExpanded: PropTypes.bool.isRequired,
    ruleId: PropTypes.string.isRequired,
    warnings: PropTypes.object.isRequired,
    onModifyRequest: PropTypes.func.isRequired
};

export default RequestUrlVariables;
