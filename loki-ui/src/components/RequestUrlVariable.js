import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    field: {
        flexGrow: 1,
        margin: theme.spacing(1)
    },
    button: {
        alignSelf: 'start',
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    }
}));

function RequestUrlVariable(props) {
    const {variable, index, ruleId, warnings, onDeleteVariable, onKeyChange, onValueChange} = props;

    const classes = useStyles();

    const handleDeleteVariable = () => {
        onDeleteVariable(index);
    };

    const handleKeyChange = event => {
        const key = event.target.value.trim();

        if (key !== variable.key) {
            onKeyChange(index, key);
        }
    };

    const handleValueChange = event => {
        const value = event.target.value.trim();

        if (value !== variable.value) {
            onValueChange(index, value);
        }
    };

    const showValueField = !variable.matchAll;

    return (
        <FormGroup row>
            <TextField
                error={!!warnings[`${ruleId}-request-variable-${index}-key`]}
                helperText={warnings[`${ruleId}-request-variable-${index}-key`]}
                variant="outlined"
                size="small"
                label="Key"
                value={variable.key}
                onChange={handleKeyChange}
                className={classes.field}
            />
            {showValueField &&
             <TextField
                 error={!!warnings[`${ruleId}-request-variable-${index}-value`]}
                 helperText={warnings[`${ruleId}-request-variable-${index}-value`]}
                 variant="outlined"
                 size="small"
                 label="Value"
                 value={variable.value}
                 onChange={handleValueChange}
                 className={classes.field}
             />}
            <IconButton onClick={handleDeleteVariable} className={classes.button}>
                <Delete/>
            </IconButton>
        </FormGroup>
    );
}

RequestUrlVariable.propTypes = {
    variable: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    ruleId: PropTypes.string.isRequired,
    warnings: PropTypes.object.isRequired,
    onDeleteVariable: PropTypes.func.isRequired,
    onKeyChange: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
};

export default RequestUrlVariable;
