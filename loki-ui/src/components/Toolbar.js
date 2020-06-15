import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MuiToolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Add, FolderOpen, OpenInBrowser, PlayArrow, Stop } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import Settings from './Settings';
import Warnings from './Warnings';
import { warningsPresent } from '../warnings';

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    actions: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    action: {
        margin: theme.spacing(1)
    },
    grow: {
        flexGrow: 1
    },
    offset: {
        marginLeft: theme.spacing(2)
    },
    start: {
        marginRight: theme.spacing(1),
        color: 'green'
    },
    stop: {
        marginRight: theme.spacing(1),
        color: 'red'
    }
}));

function Toolbar(props) {
    const {
        projects,
        currentIndex,
        onNewProject,
        onOpenProject,
        onImportProject,
        onModifyProjectAndState,
        onModifyState,
        onStartMock,
        onStopMock
    } = props;

    const [menuAnchor, setMenuAnchor] = useState(null);

    const classes = useStyles();

    const handleOpenMenu = event => {
        setMenuAnchor(event.currentTarget)
    };

    const handleCloseMenu = event => {
        event.stopPropagation();

       setMenuAnchor(null);
    };

    const handleImportProjectFromOpenApi = event => {
        handleCloseMenu(event);

        onImportProject('openapi');
    };

    const handleImportProjectFromHar = event => {
        handleCloseMenu(event);

        onImportProject('har');
    };

    const handleStartMock = () => {
        onStartMock(currentIndex);
    };

    const handleStopMock = () => {
        onStopMock(currentIndex);
    };

    const handleChangeSettings = (index, settings) => {
        onModifyProjectAndState(index, {settings: {...projects[index].project.settings, ...settings}}, {modified: true});
    };

    const hasProjects = projects.length > 0;
    const hasTabs = hasProjects && projects[currentIndex].project.tabs.length > 0;
    const hasWarnings = hasProjects && warningsPresent(projects[currentIndex].state.warnings);
    const running = hasProjects && projects[currentIndex].state.running;
    const waiting = hasProjects && projects[currentIndex].state.waiting;
    const loading = hasProjects && !running && waiting;

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <MuiToolbar className={classes.actions}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Add/>}
                    onClick={onNewProject}
                    className={classes.action}
                >
                    New project
                </Button>
                <Button
                    variant="contained"
                    color="default"
                    startIcon={<FolderOpen/>}
                    onClick={onOpenProject}
                    className={classes.action}
                >
                    Open
                </Button>
                <Button
                    variant="contained"
                    color="default"
                    startIcon={<OpenInBrowser/>}
                    onClick={handleOpenMenu}
                    className={classes.action}
                >
                    Import
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
                <div className={classes.grow}/>
                {loading && <CircularProgress color="inherit"/>}
                {hasTabs &&
                 <div className={classes.actions}>
                     {hasWarnings &&
                      <Warnings
                          project={projects[currentIndex].project}
                          state={projects[currentIndex].state}
                          index={currentIndex}
                          onModifyState={onModifyState}
                      />}
                     {!hasWarnings && !running && !waiting &&
                      <Fab variant="extended" size="small" onClick={handleStartMock} className={classes.offset}>
                          <PlayArrow className={classes.start}/>
                          Start
                      </Fab>}
                     {running && !waiting &&
                      <Fab variant="extended" size="small" onClick={handleStopMock} className={classes.offset}>
                          <Stop className={classes.stop}/>
                          Stop
                      </Fab>}
                 </div>}
                {hasProjects &&
                 <Settings
                     project={projects[currentIndex].project}
                     index={currentIndex}
                     onChangeSettings={handleChangeSettings}
                 />}
            </MuiToolbar>
        </AppBar>
    );
}

Toolbar.propTypes = {
    projects: PropTypes.array.isRequired,
    currentIndex: PropTypes.number.isRequired,
    onNewProject: PropTypes.func.isRequired,
    onOpenProject: PropTypes.func.isRequired,
    onImportProject: PropTypes.func.isRequired,
    onModifyProjectAndState: PropTypes.func.isRequired,
    onModifyState: PropTypes.func.isRequired,
    onStartMock: PropTypes.func.isRequired,
    onStopMock: PropTypes.func.isRequired
};

export default Toolbar;
