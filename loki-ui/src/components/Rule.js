import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import Request from './Request';
import Response from './Response';
import RuleHeader from './RuleHeader';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'block',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    }
}));

function Rule(props) {
    const {rule, index, lastIndex, onShiftRule, onModifyRule, onDeleteRule} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyRule(index, {expanded: expanded});
    };

    const handleModifyRequest = properties => {
        onModifyRule(index, {request: {...rule.request, ...properties}});
    };

    const handleModifyResponse = properties => {
        onModifyRule(index, {response: {...rule.response, ...properties}});
    };

    return (
        <ExpansionPanel square expanded={rule.expanded} onChange={handleStateChange}>
            <RuleHeader
                rule={rule}
                index={index}
                lastIndex={lastIndex}
                onShiftRule={onShiftRule}
                onModifyRule={onModifyRule}
                onDeleteRule={onDeleteRule}
            />
            <ExpansionPanelDetails className={classes.content}>
                <Request request={rule.request} onModifyRequest={handleModifyRequest}/>
                <Response response={rule.response} onModifyResponse={handleModifyResponse}/>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

Rule.propTypes = {
    rule: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    lastIndex: PropTypes.number.isRequired,
    onModifyRule: PropTypes.func.isRequired,
    onShiftRule: PropTypes.func.isRequired,
    onDeleteRule: PropTypes.func.isRequired
};

export default Rule;
