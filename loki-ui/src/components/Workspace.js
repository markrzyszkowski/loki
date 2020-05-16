import React, { useState } from 'react';
import Hotkeys from 'react-hot-keys';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Add, Error, FolderOpen, OpenInBrowser, PlayArrow, Stop } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import Project from './Project';
import ProjectSettings from './ProjectSettings';
import Sidebar from './Sidebar';
import ipc from '../ipc';
import { startMock, stopMock } from '../mock';
import { newProject, openProject, importProject, saveProject, defaultState } from '../project';
import { flection, handleApiError } from '../util';
import { checkWarnings } from '../warning';

const sidebarWidth = 280;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
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
    warningsOffset: {
        marginLeft: theme.spacing(2)
    },
    grow: {
        flexGrow: 1
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        maxWidth: `calc(100% - ${sidebarWidth}px)`
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
    const {project, backdrop, alert} = props;

    const [projects, setProjects] = useState([project]);
    const [projectStates, setProjectStates] = useState([checkWarnings(project, defaultState())]);
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    const [showWarningsDialog, setShowWarningsDialog] = useState(false);

    const classes = useStyles();

    const handleNewProject = () => {
        const project = newProject();

        setProjects([...projects, project]);
        setProjectStates([...projectStates, checkWarnings(project, defaultState())]);
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
        ipc.once('import-project', (ipcEvent, path) => {
            if (path) {
                importProject(path).then(project => {
                    const state = {...defaultState(), path: path};
                    setProjectStates([...projectStates, checkWarnings(project, state)]);
                    setProjects([...projects, project]);
                    setCurrentProjectIndex(projects.length);
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

    const handleSelectProject = index => {
        setCurrentProjectIndex(index);
    };

    const handleModifyProject = (index, properties) => {
        const projectsCopy = [...projects];
        projectsCopy[index] = {...projectsCopy[index], ...properties};

        setProjects(projectsCopy);
    };

    const handleModifyProjectState = (index, properties) => {
        const projectStatesCopy = [...projectStates];
        projectStatesCopy[index] = {...projectStatesCopy[index], ...properties};

        setProjectStates(projectStatesCopy);
    };

    const handleSaveProject = index => {
        if (projects.length) {
            if (projectStates[index].modified || projectStates[index].neverSaved) {
                const save = path => {
                    saveProject(path, projects[index]).then(() => {
                        handleModifyProjectState(index, {modified: false, neverSaved: false, path: path});
                    }).catch(error => {
                        handleApiError(error, alert);
                    });
                };

                if (projectStates[index].neverSaved) {
                    ipc.once('save-project', (ipcEvent, path) => {
                        if (path) {
                            save(path);
                        }
                        backdrop.hide();
                    });

                    if (!ipc.isDummy) {
                        backdrop.show();
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
            if (projectStates[index].running) {
                handleStopMock(projects[index]);
            }

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

    const handleOpenWarningsDialog = () => {
        setShowWarningsDialog(true);
    };

    const handleCloseWarningsDialog = () => {
        setShowWarningsDialog(false);
    };

    const handleNavigateToWarning = (tab, field) => {
        const index = projects[currentProjectIndex].tabs.findIndex(t => t.id === tab);
        setShowWarningsDialog(false);
        if (index !== projectStates[currentProjectIndex].activeTab) {
            handleModifyProjectState(currentProjectIndex, {activeTab: index});
        }
    };

    const handleStartMock = () => {
        handleModifyProjectState(currentProjectIndex, {waiting: true});
        startMock(projects[currentProjectIndex]).then(appliedConfiguration => {
            handleModifyProjectState(currentProjectIndex, {running: true, waiting: false, activePort: appliedConfiguration.port, activeUrls: appliedConfiguration.urls});
        }).catch(error => {
            handleApiError(error, alert);
            handleModifyProjectState(currentProjectIndex, {waiting: false});
        });
    };

    const handleStopMock = () => {
        handleModifyProjectState(currentProjectIndex, {waiting: true});
        stopMock(projects[currentProjectIndex]).catch(error => {
            handleApiError(error, alert);
        }).finally(() => {
            handleModifyProjectState(currentProjectIndex, {running: false, waiting: false});
        });
    };

    const handleSaveProjectShortcutKeyDown = (_, event) => { // TODO
        event.preventDefault();
    };

    const handleSaveProjectShortcutKeyUp = () => { // TODO
        handleSaveProject(currentProjectIndex);
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
                            variant="contained"
                            color="secondary"
                            startIcon={<Add/>}
                            onClick={handleNewProject}
                            className={classes.action}
                        >
                            New project
                        </Button>
                        <Button
                            variant="contained"
                            color="default"
                            startIcon={<FolderOpen/>}
                            onClick={handleOpenProject}
                            className={classes.action}
                        >
                            Open
                        </Button>
                        <Button
                            variant="contained"
                            color="default"
                            startIcon={<OpenInBrowser/>}
                            onClick={handleImportProject}
                            className={classes.action}
                        >
                            Import
                        </Button>
                        <div className={classes.grow}/>
                        {!!projects.length && !projectStates[currentProjectIndex].running && projectStates[currentProjectIndex].waiting &&
                         <CircularProgress color="inherit"/>}
                        {!!projects.length && !!projects[currentProjectIndex].tabs.length &&
                         <div className={classes.actions}>
                             {!!Object.entries(projectStates[currentProjectIndex].warnings).flatMap(([_, tab]) => Object.keys(tab)).length &&
                              <Chip
                                  icon={<Error/>}
                                  label={flection(Object.entries(projectStates[currentProjectIndex].warnings).flatMap(([_, tab]) => Object.keys(tab).length).reduce((x, y) => x + y, 0), 'warning', 'warnings')}
                                  onClick={handleOpenWarningsDialog}
                              />}
                             {!Object.entries(projectStates[currentProjectIndex].warnings).flatMap(([_, tab]) => Object.keys(tab)).length && !projectStates[currentProjectIndex].running && !projectStates[currentProjectIndex].waiting &&
                              <Fab variant="extended" size="small" onClick={handleStartMock} className={classes.warningsOffset}>
                                  <PlayArrow className={classes.startFabIcon}/>
                                  Start
                              </Fab>}
                             {projectStates[currentProjectIndex].running && !projectStates[currentProjectIndex].waiting &&
                              <Fab variant="extended" size="small" onClick={handleStopMock} className={classes.warningsOffset}>
                                  <Stop className={classes.stopFabIcon}/>
                                  Stop
                              </Fab>}
                         </div>}
                        {!!projects.length && <ProjectSettings
                            project={projects[currentProjectIndex]}
                            projectState={projectStates[currentProjectIndex]}
                            index={currentProjectIndex}
                            onModifyProject={handleModifyProject}
                            onModifyProjectState={handleModifyProjectState}/>}
                    </Toolbar>
                </AppBar>
                <Sidebar
                    projects={projects}
                    projectStates={projectStates}
                    currentIndex={currentProjectIndex}
                    width={sidebarWidth}
                    onSelectProject={handleSelectProject}
                    onModifyProject={handleModifyProject}
                    onModifyProjectState={handleModifyProjectState}
                    onSaveProject={handleSaveProject}
                    onDuplicateProject={handleDuplicateProject}
                    onCloseProject={handleCloseProject}
                />
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
                {!!projects.length && !!Object.entries(projectStates[currentProjectIndex].warnings).flatMap(([_, tab]) => Object.keys(tab)).length &&
                 <Dialog open={showWarningsDialog} scroll="paper" onClose={handleCloseWarningsDialog}>
                     <DialogTitle>{`Warnings for ${projects[currentProjectIndex].name}`}</DialogTitle>
                     <DialogContent>
                         <List>
                             {Object.entries(projectStates[currentProjectIndex].warnings).flatMap(([tab, warnings]) => Object.entries(warnings).map(([field, warning]) =>
                                 <ListItem button onClick={() => handleNavigateToWarning(tab, field)}>
                                     <ListItemIcon>
                                         <Error/>
                                     </ListItemIcon>
                                     <ListItemText
                                         primary={`In tab: ${projects[currentProjectIndex].tabs.find(t => t.id === tab).name}`}
                                         secondary={warning}
                                     />
                                 </ListItem>))}
                         </List>
                     </DialogContent>
                     <DialogActions>
                         <Button onClick={handleCloseWarningsDialog} color="secondary">
                             Close
                         </Button>
                     </DialogActions>
                 </Dialog>}
            </div>
        </Hotkeys>
    );
}

Workspace.propTypes = {
    project: PropTypes.object.isRequired,
    backdrop: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired
};

export default Workspace;
