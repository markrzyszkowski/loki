import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import ipc from '../ipc';
import { defaultProject, defaultState } from '../defaults';
import { openProject, importProject } from '../project';
import { handleApiError } from '../util';
import { checkWarnings } from '../warnings';

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

    const [menuAnchor, setMenuAnchor] = useState(null);

    const classes = useStyles();

    const handleOpenMenu = event => {
        setMenuAnchor(event.currentTarget)
    };

    const handleCloseMenu = event => {
        event.stopPropagation();

        setMenuAnchor(null);
    };

    const handleNewProject = () => {
        const project = defaultProject();

        onProjectInit(project, checkWarnings(project, defaultState()));
    };

    const handleOpenProject = () => {
        ipc.once('open-project', (_, path) => {
            if (path) {
                openProject(path).then(project => {
                    const state = {...defaultState(), neverSaved: false, path: path};

                    onProjectInit(project, checkWarnings(project, state));
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

    const handleImportProject = type => {
        ipc.once('import-project', (_, path) => {
            if (path) {
                importProject(path, type).then(project => {
                    const state = {...defaultState(), path: path};

                    onProjectInit(project, checkWarnings(project, state));
                }).catch(error => {
                    handleApiError(error, alert);
                });
            }
            backdrop.hide();
        });

        if (!ipc.isDummy) {
            backdrop.show();
        }

        ipc.send('import-project', type);
    };

    const handleImportProjectFromOpenApi = event => {
        handleCloseMenu(event);

        handleImportProject('openapi');
    };

    const handleImportProjectFromHar = event => {
        handleCloseMenu(event);

        handleImportProject('har');
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
                    onClick={handleOpenMenu}
                    className={classes.action}
                >
                    Import project
                </Button>
                <Menu
                    open={!!menuAnchor}
                    anchorEl={menuAnchor}
                    onClose={handleCloseMenu}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    transformOrigin={{vertical: 'top', horizontal: 'center'}}
                    getContentAnchorEl={null}
                >
                    <MenuItem onClick={handleImportProjectFromOpenApi}>OpenAPI 2.0/3.0 Spec</MenuItem>
                    <MenuItem onClick={handleImportProjectFromHar}>HAR file</MenuItem>
                </Menu>
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
