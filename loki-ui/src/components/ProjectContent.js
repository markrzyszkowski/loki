import React from 'react';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import Rule from './Rule';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2)
    },
    field: {
        margin: theme.spacing(1)
    },
    urlField: {
        flexGrow: 1
    },
    rulesWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    rulesWrapper2: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2px',
        marginBottom: theme.spacing(3)
    },
    rules: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

function ProjectContent(props) {
    const {tab, index, settings, warnings, isRunning, activePort, activeUrls, onModifyTab} = props;

    const classes = useStyles();

    const handleUrlChange = event => {
        const text = event.target.value;
        if (text !== tab.url) {
            onModifyTab(index, {url: text}, 'url');
        }
    };

    const handleAddRule = () => {
        const rule = {
            name: `Rule ${tab.rules.length + 1}`,
            request: {
                method: '',
                methodCondition: '',
                headers: [],
                parameters: [],
                body: '',
                bodyCondition: '',
                bodyIgnoreCase: false,
                bodyIgnoreWhitespace: false,
                expanded: true,
                headersExpanded: true,
                parametersExpanded: true
            },
            response: {
                statusCode: 200,
                headers: [],
                body: '',
                expanded: true,
                headersExpanded: true
            },
            active: true,
            expanded: true
        };
        onModifyTab(index, {rules: [...tab.rules, rule]});
    };

    const handleModifyRule = (ruleIndex, ruleProperties) => {
        const rulesCopy = [...tab.rules];
        rulesCopy[ruleIndex] = {...rulesCopy[ruleIndex], ...ruleProperties};

        onModifyTab(index, {rules: rulesCopy});
    };

    const handleShiftRule = (ruleIndex, ruleOffset) => {
        const rulesCopy = [...tab.rules];

        const newRuleIndex = ruleIndex + ruleOffset;
        if (newRuleIndex >= 0 && newRuleIndex < rulesCopy.length) {
            let temp = rulesCopy[ruleIndex];
            rulesCopy[ruleIndex] = rulesCopy[newRuleIndex];
            rulesCopy[newRuleIndex] = temp;

            onModifyTab(index, {rules: rulesCopy});
        }
    };

    const handleDeleteRule = ruleIndex => {
        const rulesCopy = [...tab.rules];
        rulesCopy.splice(ruleIndex, 1);

        onModifyTab(index, {rules: rulesCopy});
    };

    return (
        <div role="tabpanel" className={classes.root}>
            <FormGroup row>
                <TextField
                    error={!!warnings['url']}
                    helperText={warnings['url']}
                    label="URL"
                    placeholder="Enter request URL"
                    value={tab.url}
                    onChange={handleUrlChange}
                    className={clsx(classes.field, classes.urlField)}/>
                {settings.profile === 'STATIC' && isRunning && !!activeUrls[tab.id] && <TextField
                    label="Mock URL"
                    value={`http://localhost:${activePort}/${activeUrls[tab.id]}`}
                    InputProps={{readOnly: true}}
                    className={clsx(classes.field, classes.urlField)}/>}
            </FormGroup>
            <div className={clsx(!warnings['url'] && classes.rulesWrapper, !!warnings['url'] && classes.rulesWrapper2)}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Add/>}
                    onClick={handleAddRule}
                >
                    Add rule
                </Button>
                <div className={classes.rules}>
                    {tab.rules.map((rule, index) =>
                        <Rule rule={rule} index={index} lastIndex={tab.rules.length - 1} onModifyRule={handleModifyRule} onShiftRule={handleShiftRule} onDeleteRule={handleDeleteRule}/>)}
                </div>
            </div>
        </div>
    );
}

ProjectContent.propTypes = {
    tab: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    settings: PropTypes.object.isRequired,
    warnings: PropTypes.object.isRequired,
    isRunning: PropTypes.bool.isRequired,
    activePort: PropTypes.number.isRequired,
    activeUrls: PropTypes.object.isRequired,
    onModifyTab: PropTypes.func.isRequired
};

export default ProjectContent;
