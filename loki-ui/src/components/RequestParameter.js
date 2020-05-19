import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
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
    button: {
        minWidth: 61
    }
}));

function RequestParameter(props) {
    const {
        parameter,
        index,
        onDeleteParameter,
        onKeyChange,
        onKeyIgnoreCaseChange,
        onValueChange,
        onValueIgnoreCaseChange,
        onConditionChange
    } = props;

    const classes = useStyles();

    const ignoreEvent = event => {
        event.stopPropagation();
    };

    const handleKeyChange = event => {
        const key = event.target.value;

        onKeyChange(index, key);
    };

    const handleKeyIgnoreCaseChange = event => {
        const ignoreCase = event.target.checked;

        onKeyIgnoreCaseChange(index, ignoreCase);
    };

    const handleValueChange = event => {
        const value = event.target.value;

        onValueChange(index, value);
    };

    const handleValueIgnoreCaseChange = event => {
        const ignoreCase = event.target.checked;

        onValueIgnoreCaseChange(index, ignoreCase);
    };

    const handleConditionChange = event => {
        const condition = event.target.value;

        onConditionChange(index, condition);
    };

    return (
        <FormGroup row className={classes.fields}>
            <TextField
                label="Key"
                size="small"
                value={parameter.key}
                onChange={handleKeyChange}
                className={classes.field}
            />
            <FormControlLabel
                onClick={ignoreEvent}
                onFocus={ignoreEvent}
                control={<Checkbox checked={parameter.keyIgnoreCase} onChange={handleKeyIgnoreCaseChange}/>}
                label="ignore case"
            />
            <Select value={parameter.condition} onChange={handleConditionChange} className={classes.select}>
                <MenuItem value="PRESENT">PRESENT</MenuItem>
                <MenuItem value="NOT PRESENT">NOT PRESENT</MenuItem>
                <MenuItem value="EQUAL">EQUAL</MenuItem>
                <MenuItem value="NOT EQUAL">NOT EQUAL</MenuItem>
                <MenuItem value="CONTAINS">CONTAINS</MenuItem>
                <MenuItem value="NOT CONTAINS">NOT CONTAINS</MenuItem>
            </Select>
            <TextField
                label="Value"
                size="small"
                value={parameter.value}
                onChange={handleValueChange}
                className={classes.field}
            />
            <FormControlLabel
                onClick={ignoreEvent}
                onFocus={ignoreEvent}
                control={<Checkbox checked={parameter.valueIgnoreCase} onChange={handleValueIgnoreCaseChange}/>}
                label="ignore case"
            />
            <IconButton onClick={onDeleteParameter} className={classes.button}>
                <Delete/>
            </IconButton>
        </FormGroup>
    );
}

RequestParameter.propTypes = {
    parameter: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onDeleteParameter: PropTypes.func.isRequired,
    onKeyChange: PropTypes.func.isRequired,
    onKeyIgnoreCaseChange: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    onValueIgnoreCaseChange: PropTypes.func.isRequired,
    onConditionChange: PropTypes.func.isRequired
};

export default RequestParameter;
