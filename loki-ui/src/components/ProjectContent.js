import React from 'react';
import Fab from '@material-ui/core/Fab';
import FormGroup from '@material-ui/core/FormGroup';
import InputAdornment from '@material-ui/core/InputAdornment';
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
    const {tab, index, settings, warnings, isRunning, port, urls, onModifyTab} = props;

    const classes = useStyles();

    const handleUrlChange = event => {
        const url = event.target.value;

        // TODO validate

        if (url !== tab.url) {
            onModifyTab(index, {url: url}, warnings);
        }
    };

    const handleAddRule = () => {
        onModifyTab(index, {rules: [...tab.rules, defaultRule()]});

        // TODO validate
    };

    const handleModifyRule = (ruleIndex, properties, warnings) => {
        const rulesCopy = [...tab.rules];
        rulesCopy[ruleIndex] = {...rulesCopy[ruleIndex], ...properties};

        onModifyTab(index, {rules: rulesCopy}, warnings);
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

    const handleDuplicateRule = ruleIndex => {
        const ruleCopy = {...tab.rules[ruleIndex]};

        const rulesCopy = [...tab.rules, {...ruleCopy, name: `Copy of ${ruleCopy.name}`}];

        // TODO validate

        onModifyTab(index, {rules: rulesCopy});
    };

    const handleDeleteRule = ruleIndex => {
        const rulesCopy = [...tab.rules];
        rulesCopy.splice(ruleIndex, 1);

        // TODO validate

        onModifyTab(index, {rules: rulesCopy});
    };

    const showMockUrl = settings.profile === 'STATIC' && isRunning && !!urls[tab.id];
    const mockUrl = `http://localhost:${port}/${urls[tab.id]}`;
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
                    InputProps={{startAdornment: <InputAdornment position="start">http://</InputAdornment>}}
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
                        key={rule.id}
                        rule={rule}
                        index={index}
                        lastIndex={tab.rules.length - 1}
                        warnings={warnings}
                        onShiftRule={handleShiftRule}
                        onModifyRule={handleModifyRule}
                        onDuplicateRule={handleDuplicateRule}
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
    port: PropTypes.number.isRequired,
    urls: PropTypes.object.isRequired,
    onModifyTab: PropTypes.func.isRequired
};

export default ProjectContent;
