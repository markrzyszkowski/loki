import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import MuiToolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Add, FolderOpen, OpenInBrowser, PlayArrow, Stop } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import Settings from './Settings';
import Warnings from './Warnings';
import { warningCount } from '../warning';

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
        projectStates,
        currentIndex,
        onNewProject,
        onOpenProject,
        onImportProject,
        onModifyProject,
        onModifyProjectState,
        onStartMock,
        onStopMock
    } = props;

    const classes = useStyles();

    const handleStartMock = () => {
        onStartMock(currentIndex);
    };

    const handleStopMock = () => {
        onStopMock(currentIndex);
    };

    const handleChangeSettings = (index, settings) => {
        onModifyProject(index, {settings: {...projects[index].settings, ...settings}});
        onModifyProjectState(index, {modified: true});
    };

    const hasProjects = projects.length > 0;
    const hasTabs = hasProjects && projects[currentIndex].tabs.length > 0;
    const hasWarnings = hasProjects && warningCount(projectStates[currentIndex].warnings) > 0;
    const running = hasProjects && projectStates[currentIndex].running;
    const waiting = hasProjects && projectStates[currentIndex].waiting;
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
                    onClick={onImportProject}
                    className={classes.action}
                >
                    Import
                </Button>
                <div className={classes.grow}/>
                {loading && <CircularProgress color="inherit"/>}
                {hasTabs &&
                 <div className={classes.actions}>
                     {hasWarnings &&
                      <Warnings
                          project={projects[currentIndex]}
                          projectState={projectStates[currentIndex]}
                          index={currentIndex}
                          onModifyProjectState={onModifyProjectState}
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
                     project={projects[currentIndex]}
                     projectState={projectStates[currentIndex]}
                     index={currentIndex}
                     onChangeSettings={handleChangeSettings}
                 />}
            </MuiToolbar>
        </AppBar>
    );
}

Toolbar.propTypes = {
    projects: PropTypes.array.isRequired,
    projectStates: PropTypes.array.isRequired,
    currentIndex: PropTypes.number.isRequired,
    onNewProject: PropTypes.func.isRequired,
    onOpenProject: PropTypes.func.isRequired,
    onImportProject: PropTypes.func.isRequired,
    onModifyProject: PropTypes.func.isRequired,
    onModifyProjectState: PropTypes.func.isRequired,
    onStartMock: PropTypes.func.isRequired,
    onStopMock: PropTypes.func.isRequired
};

export default Toolbar;
