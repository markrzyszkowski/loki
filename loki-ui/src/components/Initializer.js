import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import ipc from '../ipc';
import { newProject, openProject, importProject } from '../project';
import { handleApiError } from '../util';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 450
    },
    action: {
        margin: theme.spacing(3)
    }
}));

function Initializer(props) {
    const {backdrop, alert, onProjectInit} = props;

    const classes = useStyles();

    const handleNewProject = () => {
        onProjectInit(newProject());
    };

    const handleOpenProject = () => {
        ipc.once('open-project', (_, path) => {
            if (path) {
                openProject(path).then(project => {
                    onProjectInit(project);
                }).catch(error => {
                    handleApiError(error, alert);
                });
            }
            backdrop.hide();
        });

        if (!ipc.isDummy) {
            backdrop.show();
        }
        ipc.send('open-project');
    };

    const handleImportProject = () => {
        ipc.once('import-project', (_, path) => {
            if (path) {
                importProject(path).then(project => {
                    onProjectInit(project);
                }).catch(error => {
                    handleApiError(error, alert);
                });
            }
            backdrop.hide();
        });

        if (!ipc.isDummy) {
            backdrop.show();
        }
        ipc.send('import-project');
    };

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={classes.actions}>
                <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={handleNewProject}
                    className={classes.action}
                >
                    Create new project
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    color="default"
                    onClick={handleOpenProject}
                    className={classes.action}
                >
                    Open existing project
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    color="default"
                    onClick={handleImportProject}
                    className={classes.action}
                >
                    Import project
                </Button>
            </Paper>
        </div>
    );
}

Initializer.propTypes = {
    backdrop: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    onProjectInit: PropTypes.func.isRequired
};

export default Initializer;
