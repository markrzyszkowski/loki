import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import Request from './Request';
import Response from './Response';
import RuleHeading from './RuleHeading';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'block',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    }
}));

function Rule(props) {
    const {rule, index, lastIndex, warnings, onShiftRule, onModifyRule, onDuplicateRule, onDeleteRule} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyRule(index, {expanded: expanded});
    };

    const handleModifyRequest = (properties, warnings) => {
        onModifyRule(index, {request: {...rule.request, ...properties}}, warnings);
    };

    const handleModifyResponse = (properties, warnings) => {
        onModifyRule(index, {response: {...rule.response, ...properties}}, warnings);
    };

    return (
        <ExpansionPanel square expanded={rule.expanded} onChange={handleStateChange}>
            <RuleHeading
                rule={rule}
                index={index}
                lastIndex={lastIndex}
                onShiftRule={onShiftRule}
                onModifyRule={onModifyRule}
                onDuplicateRule={onDuplicateRule}
                onDeleteRule={onDeleteRule}
            />
            <ExpansionPanelDetails className={classes.content}>
                <Request
                    request={rule.request}
                    ruleId={rule.id}
                    warnings={warnings}
                    onModifyRequest={handleModifyRequest}/>
                <Response
                    response={rule.response}
                    ruleId={rule.id}
                    warnings={warnings}
                    onModifyResponse={handleModifyResponse}/>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

Rule.propTypes = {
    rule: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    lastIndex: PropTypes.number.isRequired,
    warnings: PropTypes.object.isRequired,
    onModifyRule: PropTypes.func.isRequired,
    onShiftRule: PropTypes.func.isRequired,
    onDuplicateRule: PropTypes.func.isRequired,
    onDeleteRule: PropTypes.func.isRequired
};

export default Rule;
