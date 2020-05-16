import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import * as PropTypes from 'prop-types';

function Alert(props) {
    const {alert} = props;

    const handleClose = () => {
        alert.hide();
    };

    return (
        <Snackbar open={alert.open} autoHideDuration={5000} onClose={handleClose}>
            <MuiAlert elevation={6} variant="filled" severity={alert.severity} onClose={handleClose}>
                {alert.message}
            </MuiAlert>
        </Snackbar>
    );
}

Alert.propTypes = {
    alert: PropTypes.object.isRequired
};

export default Alert;
