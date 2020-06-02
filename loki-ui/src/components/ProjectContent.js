import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import FormGroup from '@material-ui/core/FormGroup';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Add, Help } from '@material-ui/icons';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import Rule from './Rule';
import { defaultRule } from '../defaults';
import { copyWarnings, deleteWarnings } from '../warnings';

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
    urlHelp: {
        padding: theme.spacing(2)
    },
    examples: {
        marginTop: theme.spacing(2)
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

    const [urlHelpAnchor, setUrlHelpAnchor] = useState(null);

    const classes = useStyles();

    const handleOpenUrlHelp = event => {
        setUrlHelpAnchor(event.currentTarget);
    };

    const handleCloseUrlHelp = () => {
        setUrlHelpAnchor(null);
    };

    const handleUrlChange = event => {
        const url = event.target.value.trim();

        if (url !== tab.url) {
            const warningsCopy = {...warnings};

            onModifyTab(index, {url: url}, warningsCopy);
        }
    };

    const handleAddRule = () => {
        onModifyTab(index, {rules: [...tab.rules, defaultRule()]});
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

        const ruleId = uuid();

        const rulesCopy = [...tab.rules, {...ruleCopy, id: ruleId, name: `Copy of ${ruleCopy.name}`}];

        const warningsCopy = {...warnings};
        copyWarnings(`${tab.rules[ruleIndex].id}`, ruleId, warningsCopy);

        onModifyTab(index, {rules: rulesCopy}, warningsCopy);
    };

    const handleDeleteRule = ruleIndex => {
        const rulesCopy = [...tab.rules];
        rulesCopy.splice(ruleIndex, 1);

        const warningsCopy = {...warnings};
        deleteWarnings(`${tab.rules[ruleIndex].id}`, warningsCopy);

        onModifyTab(index, {rules: rulesCopy}, warningsCopy);
    };

    const urlStartAdornment = <InputAdornment position="start">http://</InputAdornment>;
    const urlEndAdornment =
        <InputAdornment position="end">
            <IconButton onClick={handleOpenUrlHelp}>
                <Help/>
            </IconButton>
            <Popover
                open={!!urlHelpAnchor}
                anchorEl={urlHelpAnchor}
                onClose={handleCloseUrlHelp}
                anchorOrigin={{vertical: 'center', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <div className={classes.urlHelp}>
                    <Typography>
                        You can define parts of the path of a URL as variables that will be later used for matching them against rules.
                    </Typography>
                    <Typography>
                        To define URL variable simply surround it with double curly braces; like so: <b>{'{{var}}'}</b>.
                    </Typography>
                    <div className={classes.examples}>
                        <Typography >Examples:</Typography>
                        <Typography>
                            <i>Incorrect:</i> en.wikipedia<b>{'{{var}}'}</b>.org/wiki/URL
                        </Typography>
                        <Typography>
                            <i>Incorrect:</i> en.wikipedia.org/wi<b>{'{{ki/U}}'}</b>RL
                        </Typography>
                        <Typography>
                            <i>Incorrect:</i> en.wikipedia.org/<b>{'{{var}}'}</b>/<b>{'{{var}}'}</b>
                        </Typography>
                        <Typography>
                            <i>Correct:</i> en.wikipedia.org/<b>{'{{var}}'}</b>/URL
                        </Typography>
                        <Typography>
                            <i>Correct:</i> en.wikipedia.org/<b>{'{{var1}}'}</b>/<b>{'{{var2}}'}</b>
                        </Typography>
                    </div>
                </div>
            </Popover>
        </InputAdornment>;

    const showMockUrl = settings.profile === 'STATIC' && isRunning && !!urls[tab.id];
    const mockUrl = `http://localhost:${port}/${urls[tab.id]}`;
    const rulesClass = clsx(!warnings['url'] && classes.rules, !!warnings['url'] && classes.rulesOffset);

    return (
        <div role="tabpanel" className={classes.root}>
            <FormGroup row>
                <TextField
                    error={!!warnings['url']}
                    helperText={warnings['url']}
                    variant="outlined"
                    label="URL"
                    placeholder="Enter request URL"
                    value={tab.url}
                    onChange={handleUrlChange}
                    InputProps={{startAdornment: urlStartAdornment, endAdornment: urlEndAdornment}}
                    className={clsx(classes.field, classes.urlField)}
                />
                {showMockUrl &&
                 <TextField
                     variant="outlined"
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
