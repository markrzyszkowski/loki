import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { ExpandMore } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

function Rule(props) {
    const {rule, index, onDeleteRule} = props;

    const classes = useStyles();

    return (
        <ExpansionPanel expanded={rule.expanded}>
            <ExpansionPanelSummary expandIcon={<ExpandMore/>} className={classes.header}>
                {/*<FormControlLabel*/}
                {/*    onClick={(event) => event.stopPropagation()}*/}
                {/*    onFocus={(event) => event.stopPropagation()}*/}
                {/*    control={<IconButton size="small"><KeyboardArrowUp/></IconButton>}*/}
                {/*    label={null}*/}
                {/*/>*/}
                {/*<FormControlLabel*/}
                {/*    onClick={(event) => event.stopPropagation()}*/}
                {/*    onFocus={(event) => event.stopPropagation()}*/}
                {/*    control={<IconButton size="small"><KeyboardArrowDown/></IconButton>}*/}
                {/*    label={null}*/}
                {/*/>*/}
                {/*<IconButton*/}
                {/*    size="small"*/}
                {/*    onClick={(event) => event.stopPropagation()}*/}
                {/*    onFocus={(event) => event.stopPropagation()}*/}
                {/*>*/}
                {/*    <KeyboardArrowUp/>*/}
                {/*</IconButton>*/}
                {/*<IconButton*/}
                {/*    size="small"*/}
                {/*    onClick={(event) => event.stopPropagation()}*/}
                {/*    onFocus={(event) => event.stopPropagation()}*/}
                {/*>*/}
                {/*    <KeyboardArrowDown/>*/}
                {/*</IconButton>*/}
                <Typography>Expansion Panel</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Typography>
                    
                </Typography>
            </ExpansionPanelDetails>
        </ExpansionPanel>);
}

Rule.propTypes = {
    rule: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onDeleteRule: PropTypes.func.isRequired
};

export default Rule;
