import React, { useState } from 'react';
import Hotkeys from 'react-hot-keys';
import AppBar from '@material-ui/core/AppBar';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Add, Error, FolderOpen, OpenInBrowser, PlayArrow, Stop } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import Project from './Project';
import ProjectItem from './ProjectItem';
import { Alert } from './Util';
import ipc from '../ipc';
import { newProject, openProject, importProject, saveProject, defaultState } from '../project';
import { flection, handleApiError } from '../util';
import { checkWarnings } from '../warning';

const drawerWidth = 280;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 2
    },
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
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        maxWidth: `calc(100% - ${drawerWidth}px)`
    },
    projectsList: {
        padding: 0
    },
    startFabIcon: {
        marginRight: theme.spacing(1),
        color: 'green'
    },
    stopFabIcon: {
        marginRight: theme.spacing(1),
        color: 'red'
    }
}));

function Workspace(props) {
    const {initialProject} = props;

    const [projectStates, setProjectStates] = useState([checkWarnings(initialProject, defaultState())]);
    const [projects, setProjects] = useState([initialProject]);
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarContent, setSnackbarContent] = useState({});

    const classes = useStyles();

    const handleNewProject = () => {
        const project = newProject();
        setProjectStates([...projectStates, checkWarnings(project, defaultState())]);
        setProjects([...projects, project]);
        setCurrentProjectIndex(projects.length);
    };

    const handleOpenProject = () => {
        const isAlreadyOpen = newProject => {
            return !!projects.find(project => project.id === newProject.id);
        };

        const getProjectIndex = newProject => {
            return projects.findIndex(project => project.id === newProject.id);
        };

        ipc.once('open-project', (ipcEvent, path) => {
            if (path) {
                openProject(path).then(project => {
                    if (isAlreadyOpen(project)) {
                        setCurrentProjectIndex(getProjectIndex(project));
                    } else {
                        const state = {...defaultState(), neverSaved: false, path: path};
                        setProjectStates([...projectStates, checkWarnings(project, state)]);
                        setProjects([...projects, project]);
                        setCurrentProjectIndex(projects.length);
                    }
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
                    const state = {...defaultState(), path: path};
                    setProjectStates([...projectStates, checkWarnings(project, state)]);
                    setProjects([...projects, project]);
                    setCurrentProjectIndex(projects.length);
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

    const handleSelectProject = index => {
        setCurrentProjectIndex(index);
    };

    const handleModifyProject = (index, projectProperties) => {
        const projectsCopy = [...projects];
        projectsCopy[index] = {
            ...projectsCopy[index],
            ...projectProperties
        };
        setProjects(projectsCopy);
    };

    const handleModifyProjectState = (index, projectStateProperties) => {
        const projectStatesCopy = [...projectStates];
        projectStatesCopy[index] = {
            ...projectStatesCopy[index],
            ...projectStateProperties
        };
        setProjectStates(projectStatesCopy);
    };

    const handleSaveProjectShortcutKeyDown = (_, event) => {
        event.preventDefault();
    };

    const handleSaveProjectShortcutKeyUp = () => {
        handleSaveProject(currentProjectIndex);
    };

    const handleSaveProject = index => {
        if (projects.length) {
            if (projectStates[index].modified || projectStates[index].neverSaved) {
                const save = path => {
                    saveProject(path, projects[index]).then(() => {
                        handleModifyProjectState(index, {modified: false, neverSaved: false, path: path});
                    }).catch(error => {
                        handleApiError(error, setSnackbarContent, setShowSnackbar);
                    });
                };

                if (projectStates[index].neverSaved) {
                    ipc.once('save-project', (ipcEvent, path) => {
                        if (path) {
                            save(path);
                        }
                        setShowBackdrop(false);
                    });

                    if (!ipc.isDummy) {
                        setShowBackdrop(true);
                    }
                    ipc.send('save-project');
                } else {
                    save(projectStates[index].path);
                }
            }
        }
    };

    const handleDuplicateProject = index => {
        const projectCopy = {...projects[index]};
        setProjectStates([...projectStates, defaultState()]);
        setProjects([...projects, {...projectCopy, id: uuid(), name: `Copy of ${projectCopy.name}`}]);
        setCurrentProjectIndex(projects.length);
    };

    const handleCloseProject = index => {
        if (projects.length) {
            const projectsCopy = [...projects];
            projectsCopy.splice(index, 1);
            setProjects(projectsCopy);

            const projectStatesCopy = [...projectStates];
            projectStatesCopy.splice(index, 1);
            setProjectStates(projectStatesCopy);

            if (index === currentProjectIndex && index === 0) {
                setCurrentProjectIndex(0);
            } else if (index <= currentProjectIndex) {
                setCurrentProjectIndex(currentProjectIndex - 1);
            }
        }
    };

    const handleStartMock = () => {
        handleModifyProjectState(currentProjectIndex, {running: true});
    };

    const handleStopMock = () => {
        handleModifyProjectState(currentProjectIndex, {running: false});
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    return (
        <Hotkeys
            keyName="ctrl+s,command+s"
            onKeyDown={handleSaveProjectShortcutKeyDown}
            onKeyUp={handleSaveProjectShortcutKeyUp}
        >
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar className={classes.actions}>
                        <Button
                            component="label"
                            variant="contained"
                            color="secondary"
                            startIcon={<Add/>}
                            onClick={handleNewProject}
                            className={classes.action}
                        >
                            New project
                        </Button>
                        <Button
                            component="label"
                            variant="contained"
                            color="default"
                            startIcon={<FolderOpen/>}
                            onClick={handleOpenProject}
                            className={classes.action}
                        >
                            Open
                        </Button>
                        <Button
                            component="label"
                            variant="contained"
                            color="default"
                            startIcon={<OpenInBrowser/>}
                            onClick={handleImportProject}
                            className={classes.action}
                        >
                            Import
                        </Button>
                        <div className={classes.grow}/>
                        {!!projects.length && !!projects[currentProjectIndex].tabs.length &&
                         <div className={classes.actions}>
                             {!!Object.entries(projectStates[currentProjectIndex].warnings).flatMap(([_, tab]) => Object.keys(tab)).length &&
                              <Chip
                                  icon={<Error/>}
                                  label={flection(Object.entries(projectStates[currentProjectIndex].warnings).flatMap(([_, tab]) => Object.keys(tab).length).reduce((x, y) => x + y, 0), 'warning', 'warnings')}
                              />}
                             {!Object.entries(projectStates[currentProjectIndex].warnings).flatMap(([_, tab]) => Object.keys(tab)).length && !projectStates[currentProjectIndex].running &&
                              <Fab component="label" variant="extended" size="small" onClick={handleStartMock}>
                                  <PlayArrow className={classes.startFabIcon}/>
                                  Start
                              </Fab>}
                             {projectStates[currentProjectIndex].running &&
                              <Fab component="label" variant="extended" size="small" onClick={handleStopMock}>
                                  <Stop className={classes.stopFabIcon}/>
                                  Stop
                              </Fab>}
                         </div>}
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" className={classes.drawer} classes={{paper: classes.drawer}}>
                    <div className={classes.toolbar}/>
                    <List className={classes.projectsList}>
                        {projects.map((project, index) =>
                            <ProjectItem
                                project={project}
                                projectState={projectStates[index]}
                                index={index}
                                currentIndex={currentProjectIndex}
                                onSelectProject={handleSelectProject}
                                onModifyProject={handleModifyProject}
                                onModifyProjectState={handleModifyProjectState}
                                onSaveProject={handleSaveProject}
                                onDuplicateProject={handleDuplicateProject}
                                onCloseProject={handleCloseProject}
                            />)}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>
                    {!!projects.length && <Project
                        project={projects[currentProjectIndex]}
                        projectState={projectStates[currentProjectIndex]}
                        index={currentProjectIndex}
                        onModifyProject={handleModifyProject}
                        onModifyProjectState={handleModifyProjectState}
                    />}
                </main>
                <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                    <Alert severity={snackbarContent.severity} onClose={handleCloseSnackbar}>
                        {snackbarContent.message}
                    </Alert>
                </Snackbar>
                <Backdrop open={showBackdrop} className={classes.backdrop}/>
            </div>
        </Hotkeys>
    );
}

Workspace.propTypes = {
    initialProject: PropTypes.object.isRequired
};

export default Workspace;
