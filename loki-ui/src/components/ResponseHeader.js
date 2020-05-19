import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { Delete } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    fields: {
        width: '100%'
    },
    field: {
        flexGrow: 1,
        margin: theme.spacing(1)
    },
    button: {
        minWidth: 61
    }
}));

function ResponseHeader(props) {
    const {header, index, onDeleteHeader, onKeyChange, onValueChange} = props;

    const classes = useStyles();

    const handleDeleteHeader = () => {
        onDeleteHeader(index);
    };

    const handleKeyChange = event => {
        const key = event.target.value;

        onKeyChange(index, key);
    };

    const handleValueChange = event => {
        const value = event.target.value;

        onValueChange(index, value);
    };

    return (
        <FormGroup row className={classes.fields}>
            <TextField
                label="Key"
                size="small"
                value={header.key}
                onChange={handleKeyChange}
                className={classes.field}
            />
            <TextField
                label="Value"
                size="small"
                value={header.value}
                onChange={handleValueChange}
                className={classes.field}
            />
            <IconButton onClick={handleDeleteHeader} className={classes.button}>
                <Delete/>
            </IconButton>
        </FormGroup>
    );
}

ResponseHeader.propTypes = {
    header: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onDeleteHeader: PropTypes.func.isRequired,
    onKeyChange: PropTypes.func.isRequired,
    onValueChange: PropTypes.func.isRequired
};

export default ResponseHeader;
