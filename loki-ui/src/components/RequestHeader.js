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

function RequestHeader(props) {
    const {
        header,
        index,
        ruleId,
        warnings,
        onDeleteHeader,
        onKeyChange,
        onValueChange,
        onValueIgnoreCaseChange,
        onConditionChange
    } = props;

    const classes = useStyles();

    const ignoreEvent = event => {
        event.stopPropagation();
    };

    const handleDeleteHeader = () => {
        onDeleteHeader(index);
    };

    const handleKeyChange = event => {
        const key = event.target.value.trim();

        if (key !== header.key) {
            onKeyChange(index, key);
        }
    };

    const handleValueChange = event => {
        const value = event.target.value.trim();

        if (value !== header.value) {
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

    const showValueField = !header.condition.includes('PRESENT');

    return (
        <FormGroup row className={classes.fields}>
            <TextField
                error={!!warnings[`${ruleId}-request-header-${index}-key`]}
                helperText={warnings[`${ruleId}-request-header-${index}-key`]}
                variant="outlined"
                size="small"
                label="Key"
                value={header.key}
                onChange={handleKeyChange}
                className={classes.field}
            />
            <TextField
                select
                variant="outlined"
                size="small"
                value={header.condition}
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
                    error={!!warnings[`${ruleId}-request-header-${index}-value`]}
                    helperText={warnings[`${ruleId}-request-header-${index}-value`]}
                    variant="outlined"
                    size="small"
                    label="Value"
                    value={header.value}
                    onChange={handleValueChange}
                    className={classes.field}
                />
                <FormControlLabel
                    onClick={ignoreEvent}
                    onFocus={ignoreEvent}
                    control={<Checkbox checked={header.valueIgnoreCase} onChange={handleValueIgnoreCaseChange}/>}
                    label="ignore case"
                />
            </>}
            <IconButton onClick={handleDeleteHeader} className={classes.button}>
                <Delete/>
            </IconButton>
        </FormGroup>
    );
}

RequestHeader.propTypes = {
    header: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    ruleId: PropTypes.string.isRequired,
    warnings: PropTypes.object.isRequired,
    onDeleteHeader: PropTypes.func.isRequired,
    onKeyChange: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired,
    onValueIgnoreCaseChange: PropTypes.func.isRequired,
    onConditionChange: PropTypes.func.isRequired
};

export default RequestHeader;
