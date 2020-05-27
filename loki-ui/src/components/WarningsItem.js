import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Error } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

function WarningsItem(props) {
    const {name, tab, field, warning, onNavigateToWarning} = props;

    const handleNavigateToWarning = () => {
        onNavigateToWarning(tab);
    };

    return (
        <ListItem button onClick={handleNavigateToWarning}>
            <ListItemIcon>
                <Error/>
            </ListItemIcon>
            <ListItemText primary={`In tab: ${name}`} secondary={warning}/>
        </ListItem>
    );
}

WarningsItem.propTypes = {
    name: PropTypes.string.isRequired,
    tab: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    warning: PropTypes.string.isRequired,
    onNavigateToWarning: PropTypes.func.isRequired
};

export default WarningsItem;
