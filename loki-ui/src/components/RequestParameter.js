import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import { ignoreEvent } from '../util';

const useStyles = makeStyles(theme => ({
    field: {
        flexGrow: 1,
        margin: theme.spacing(1)
    },
    select: {
        margin: theme.spacing(1),
        width: 168
    },
    checkbox: {
        alignSelf: 'start',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(0.25),
    },
    button: {
        alignSelf: 'start',
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
}));

function RequestParameter(props) {
    const {
        parameter,
        index,
        ruleId,
        warnings,
        onDeleteParameter,
        onKeyChange,
        onKeyIgnoreCaseChange,
        onValueChange,
        onValueIgnoreCaseChange,
        onConditionChange
    } = props;

    const classes = useStyles();

    const handleDeleteParameter = () => {
        onDeleteParameter(index);
    };

    const handleKeyChange = event => {
        const key = event.target.value.trim();

        if (key !== parameter.key) {
            onKeyChange(index, key);
        }
    };

    const handleKeyIgnoreCaseChange = event => {
        const ignoreCase = event.target.checked;

        onKeyIgnoreCaseChange(index, ignoreCase);
    };

    const handleValueChange = event => {
        const value = event.target.value.trim();

        if (value !== parameter.value) {
            onValueChange(index, value);
        }
    };

    const handleValueIgnoreCaseChange = event => {
        const ignoreCase = event.target.checked;

        onValueIgnoreCaseChange(index, ignoreCase);
    };

    const handleConditionChange = event => {
        const condition = event.target.value;

        onConditionChange(index, condition);
    };

    const showValueField = !parameter.condition.includes('PRESENT');

    return (
        <FormGroup row>
            <TextField
                error={!!warnings[`${ruleId}-request-parameter-${index}-key`]}
                helperText={warnings[`${ruleId}-request-parameter-${index}-key`]}
                variant="outlined"
                size="small"
                label="Key"
                value={parameter.key}
                onChange={handleKeyChange}
                className={classes.field}
            />
            <FormControlLabel
                onClick={ignoreEvent}
                onFocus={ignoreEvent}
                control={<Checkbox checked={parameter.keyIgnoreCase} onChange={handleKeyIgnoreCaseChange}/>}
                label="ignore case"
                className={classes.checkbox}
            />
            <TextField
                select
                variant="outlined"
                size="small"
                value={parameter.condition}
                onChange={handleConditionChange}
                className={classes.select}
            >
                <MenuItem value="PRESENT">PRESENT</MenuItem>
                <MenuItem value="NOT_PRESENT">NOT PRESENT</MenuItem>
                <MenuItem value="EQUAL">EQUAL</MenuItem>
                <MenuItem value="NOT_EQUAL">NOT EQUAL</MenuItem>
                <MenuItem value="CONTAINS">CONTAINS</MenuItem>
                <MenuItem value="NOT_CONTAINS">NOT CONTAINS</MenuItem>
            </TextField>
            {showValueField &&
             <>
                 <TextField
                     error={!!warnings[`${ruleId}-request-parameter-${index}-value`]}
                     helperText={warnings[`${ruleId}-request-parameter-${index}-value`]}
                     variant="outlined"
                     size="small"
                     label="Value"
                     value={parameter.value}
                     onChange={handleValueChange}
                     className={classes.field}
                 />
                 <FormControlLabel
                     onClick={ignoreEvent}
                     onFocus={ignoreEvent}
                     control={<Checkbox checked={parameter.valueIgnoreCase} onChange={handleValueIgnoreCaseChange}/>}
                     label="ignore case"
                     className={classes.checkbox}
                 />
             </>}
            <IconButton onClick={handleDeleteParameter} className={classes.button}>
                <Delete/>
            </IconButton>
        </FormGroup>
    );
}

RequestParameter.propTypes = {
    parameter: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    ruleId: PropTypes.string.isRequired,
    warnings: PropTypes.object.isRequired,
    onDeleteParameter: PropTypes.func.isRequired,
    onKeyChange: PropTypes.func.isRequired,
    onKeyIgnoreCaseChange: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    onValueIgnoreCaseChange: PropTypes.func.isRequired,
    onConditionChange: PropTypes.func.isRequired
};

export default RequestParameter;
