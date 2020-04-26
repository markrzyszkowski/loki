import React, { useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import ipc from '../ipc';
import { newProject, openProject, importProject } from '../project';

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

    const classes = useStyles();

    const handleNewProject = () => {
        onProjectInit(newProject());
    };

    const handleOpenProject = () => {
        ipc.once('open-project', (ipcEvent, path) => {
            if (path) {
                openProject(path).then(project => {
                    onProjectInit(project);
                }).catch(error => { // TODO handling
                    if (error.response) {
                        console.log(error.response.data);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
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
                }).catch(error => { // TODO handling
                    if (error.response) {
                        console.log(error.response.data);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log(error.message);
                    }
                });
            }
            setShowBackdrop(false);
        });

        if (!ipc.isDummy) {
            setShowBackdrop(true);
        }
        ipc.send('import-project');
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
            <Backdrop open={showBackdrop} className={classes.backdrop}/>
        </div>
    );
}

Initializer.propTypes = {
    onProjectInit: PropTypes.func.isRequired
};

export default Initializer;
