import React from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Add, ExpandMore } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import RequestParameter from './RequestParameter';
import ExpansionPanelSummary from './mui/ExpansionPanelSummary';
import { defaultParameterWithConditions } from '../defaults';
import { validators } from '../warnings';

const useStyles = makeStyles(theme => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    contentOffset: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: '2px',
        marginBottom: theme.spacing(3)
    },
    fullWidth: {
        width: '100%'
    },
    parameters: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(0)
    },
    button: {
        marginBottom: theme.spacing(2)
    }
}));

function RequestParameters(props) {
    const {parameters, parametersExpanded, ruleId, warnings, onModifyRequest} = props;

    const classes = useStyles();

    const handleStateChange = (_, expanded) => {
        onModifyRequest({parametersExpanded: expanded});
    };

    const handleAddParameter = () => {
        onModifyRequest({parameters: [...parameters, defaultParameterWithConditions()]});

        // TODO validate
    };

    const handleDeleteParameter = index => {
        const parametersCopy = [...parameters];
        parametersCopy.splice(index, 1);

        // TODO validate

        onModifyRequest({parameters: parametersCopy});
    };

    const handleParameterKeyChange = (index, key) => {
        const parametersCopy = [...parameters];
        parametersCopy[index] = {...parametersCopy[index], key: key};

        validators.parameterKey(key, ruleId, index, warnings);

        onModifyRequest({parameters: parametersCopy}, warnings);
    };

    const handleParameterKeyIgnoreCaseChange = (index, ignoreCase) => {
        const parametersCopy = [...parameters];
        parametersCopy[index] = {...parametersCopy[index], keyIgnoreCase: ignoreCase};

        onModifyRequest({parameters: parametersCopy});
    };

    const handleParameterValueChange = (index, value) => {
        const parametersCopy = [...parameters];
        parametersCopy[index] = {...parametersCopy[index], value: value};

        validators.parameterValue(value, ruleId, index, warnings);

        onModifyRequest({parameters: parametersCopy}, warnings);
    };

    const handleParameterValueIgnoreCaseChange = (index, ignoreCase) => {
        const parametersCopy = [...parameters];
        parametersCopy[index] = {...parametersCopy[index], valueIgnoreCase: ignoreCase};

        onModifyRequest({parameters: parametersCopy});
    };

    const handleParameterConditionChange = (index, condition) => {
        const parametersCopy = [...parameters];
        parametersCopy[index] = {...parametersCopy[index], condition: condition};

        // TODO validate

        onModifyRequest({parameters: parametersCopy});
    };

    const contentClass = classes.content;
    const hasParameters = parameters.length > 0;

    return (
        <div className={contentClass}>
            {!hasParameters &&
             <Button
                 variant="contained"
                 color="secondary"
                 startIcon={<Add/>}
                 onClick={handleAddParameter}
             >
                 Add parameter
             </Button>}
             {hasParameters &&
              <div className={classes.fullWidth}>
                  <ExpansionPanel square expanded={parametersExpanded} onChange={handleStateChange}>
                      <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                          <Typography>Parameters</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                          <div className={classes.parameters}>
                              <Button
                                  variant="contained"
                                  color="secondary"
                                  startIcon={<Add/>}
                                  onClick={handleAddParameter}
                                  className={classes.button}
                              >
                                  Add parameter
                              </Button>
                              {parameters.map((parameter, index) =>
                                  <RequestParameter
                                    parameter={parameter}
                                    index={index}
                                    ruleId={ruleId}
                                    warnings={warnings}
                                    onDeleteParameter={handleDeleteParameter}
                                    onKeyChange={handleParameterKeyChange}
                                    onKeyIgnoreCaseChange={handleParameterKeyIgnoreCaseChange}
                                    onValueChange={handleParameterValueChange}
                                    onValueIgnoreCaseChange={handleParameterValueIgnoreCaseChange}
                                    onConditionChange={handleParameterConditionChange}
                                  />
                              )}
                          </div>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
              </div>}
        </div>
    );
}

RequestParameters.propTypes = {
    parameters: PropTypes.array.isRequired,
    parametersExpanded: PropTypes.bool.isRequired,
    ruleId: PropTypes.string.isRequired,
    warnings: PropTypes.object.isRequired,
    onModifyRequest: PropTypes.func.isRequired
};

export default RequestParameters;
