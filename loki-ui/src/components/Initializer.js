import React, { useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import { Alert } from './Util';
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
    backdrop: {
        zIndex: theme.zIndex.drawer + 2
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '450px'
    },
    action: {
        margin: theme.spacing(3)
    }
}));

function Initializer(props) {
    const {onProjectInit} = props;

    const [showBackdrop, setShowBackdrop] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({});

    const classes = useStyles();

    const handleNewProject = () => {
        onProjectInit(newProject());
    };

    const handleOpenProject = () => {
        ipc.once('open-project', (ipcEvent, path) => {
            if (path) {
                openProject(path).then(project => {
                    onProjectInit(project);
                }).catch(error => {
                    handleApiError(error, setSnackbarContent, setShowSnackbar);
                });
            }
            setShowBackdrop(false);
        });

        if (!ipc.isDummy) {
            setShowBackdrop(true);
        }
        ipc.send('open-project');
    };

    const handleImportProject = () => {
        ipc.once('import-project', (ipcEvent, path) => {
            if (path) {
                importProject(path).then(project => {
                    onProjectInit(project);
                }).catch(error => {
                    handleApiError(error, setSnackbarContent, setShowSnackbar);
                });
            }
            setShowBackdrop(false);
        });

        if (!ipc.isDummy) {
            setShowBackdrop(true);
        }
        ipc.send('import-project');
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    return (
        <div className={classes.root}>
            <Paper elevation={3} className={classes.actions}>
                <Button
                    component="label"
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={handleNewProject}
                    className={classes.action}
                >
                    Create new project
                </Button>
                <Button
                    component="label"
                    variant="contained"
                    size="large"
                    color="default"
                    onClick={handleOpenProject}
                    className={classes.action}
                >
                    Open existing project
                </Button>
                <Button
                    component="label"
                    variant="contained"
                    size="large"
                    color="default"
                    onClick={handleImportProject}
                    className={classes.action}
                >
                    Import project
                </Button>
            </Paper>
            <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <Alert severity={snackbarContent.severity} onClose={handleCloseSnackbar}>
                    {snackbarContent.message}
                </Alert>
            </Snackbar>
            <Backdrop open={showBackdrop} className={classes.backdrop}/>
        </div>
    );
}

Initializer.propTypes = {
    onProjectInit: PropTypes.func.isRequired
};

export default Initializer;
