import React from 'react';
import Fab from '@material-ui/core/Fab';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import Rule from './Rule';
import { defaultRule } from '../defaults';

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
    button: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    },
    rules: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(9)
    },
    rulesOffset: {
        marginTop: '2px',
        marginBottom: theme.spacing(9)
    }
}));

function ProjectContent(props) {
    const {tab, index, settings, warnings, isRunning, activePort, activeUrls, onModifyTab} = props;

    const classes = useStyles();

    const handleUrlChange = event => {
        const url = event.target.value;

        if (url !== tab.url) {
            onModifyTab(index, {url: url}, 'url');
        }
    };

    const handleAddRule = () => {
        onModifyTab(index, {rules: [...tab.rules, defaultRule(tab.rules.length + 1)]});
    };

    const handleModifyRule = (ruleIndex, properties) => {
        const rulesCopy = [...tab.rules];
        rulesCopy[ruleIndex] = {...rulesCopy[ruleIndex], ...properties};

        onModifyTab(index, {rules: rulesCopy});
    };

    const handleShiftRule = (ruleIndex, offset) => {
        const rulesCopy = [...tab.rules];

        const newRuleIndex = ruleIndex + offset;
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

    const showMockUrl = settings.profile === 'STATIC' && isRunning && !!activeUrls[tab.id];
    const mockUrl = `http://localhost:${activePort}/${activeUrls[tab.id]}`;
    const rulesClass = clsx(!warnings['url'] && classes.rules, !!warnings['url'] && classes.rulesOffset);

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
                    className={clsx(classes.field, classes.urlField)}
                />
                {showMockUrl &&
                 <TextField
                    label="Mock URL"
                    value={mockUrl}
                    InputProps={{readOnly: true}}
                    className={clsx(classes.field, classes.urlField)}
                 />}
            </FormGroup>
            <div className={rulesClass}>
                {tab.rules.map((rule, index) =>
                    <Rule
                        rule={rule}
                        index={index}
                        lastIndex={tab.rules.length - 1}
                        onModifyRule={handleModifyRule}
                        onShiftRule={handleShiftRule}
                        onDeleteRule={handleDeleteRule}
                    />)}
            </div>
            <Fab color="secondary" onClick={handleAddRule} className={classes.button}>
                <Add/>
            </Fab>
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
