import React, { useState } from 'react';
import Hotkeys from 'react-hot-keys';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import Project from './Project';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import { defaultProject, defaultState } from '../defaults';
import ipc from '../ipc';
import { startMock, stopMock } from '../mock';
import { openProject, importProject, exportProject, saveProject } from '../project';
import { handleApiError } from '../util';
import { checkWarnings } from '../warning';

const sidebarWidth = 280;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    content: {
        flexGrow: 1,
        maxWidth: `calc(100% - ${sidebarWidth}px)`
    }
}));

function Workspace(props) {
    const {project, backdrop, alert} = props;

    const [projects, setProjects] = useState([project]);
    const [projectStates, setProjectStates] = useState([checkWarnings(project, defaultState())]);
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

    const classes = useStyles();

    const handleShortcutKeyDown = (_, event) => {
        event.preventDefault();
    };

    const handleShortcutKeyUp = () => {
        handleSaveProject(currentProjectIndex);
    };

    const handleNewProject = () => {
        const project = defaultProject();

        setProjects([...projects, project]);
        setProjectStates([...projectStates, checkWarnings(project, defaultState())]);
        setCurrentProjectIndex(projects.length);
    };

    const handleOpenProject = () => {
        const getProjectIndex = newProject => {
            return projects.findIndex(project => project.id === newProject.id);
        };

        const isAlreadyOpen = newProject => {
            return getProjectIndex(newProject) !== -1;
        };

        ipc.once('open-project', (ipcEvent, path) => {
            if (path) {
                openProject(path).then(project => {
                    if (isAlreadyOpen(project)) {
                        setCurrentProjectIndex(getProjectIndex(project));
                    } else {
                        const state = {...defaultState(), neverSaved: false, path: path};

                        setProjects([...projects, project]);
                        setProjectStates([...projectStates, checkWarnings(project, state)]);
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

                    setProjects([...projects, project]);
                    setProjectStates([...projectStates, checkWarnings(project, state)]);
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

    const handleSelectProject = index => {
        setCurrentProjectIndex(index);
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

        setProjects([...projects, {...projectCopy, id: uuid(), name: `Copy of ${projectCopy.name}`}]);
        setProjectStates([...projectStates, defaultState()]);
        setCurrentProjectIndex(projects.length);
    };

    const handleExportProject = index => {
        ipc.once('export-project', (ipcEvent, path) => {
            if (path) {
                exportProject(path, projects[index]).catch(error => {
                    handleApiError(error, alert);
                });
            }

            backdrop.hide();
        });

        if (!ipc.isDummy) {
            backdrop.show();
        }

        ipc.send('export-project');
    };

    const handleCloseProject = index => {
        if (projects.length) {
            if (projectStates[index].running) {
                handleStopMock(index);
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

    const handleStartMock = index => {
        handleModifyProjectState(index, {waiting: true});

        startMock(projects[index]).then(configuration => {
            handleModifyProjectState(index, {
                running: true,
                waiting: false,
                activePort: configuration.port,
                activeUrls: configuration.urls
            });
        }).catch(error => {
            handleApiError(error, alert);
            handleModifyProjectState(index, {waiting: false});
        });
    };

    const handleStopMock = index => {
        handleModifyProjectState(index, {waiting: true});

        stopMock(projects[index]).catch(error => {
            handleApiError(error, alert);
        }).finally(() => {
            handleModifyProjectState(index, {running: false, waiting: false});
        });
    };

    return (
        <Hotkeys
            keyName="ctrl+s,command+s"
            onKeyDown={handleShortcutKeyDown}
            onKeyUp={handleShortcutKeyUp}
        >
            <div className={classes.root}>
                <Toolbar
                    projects={projects}
                    projectStates={projectStates}
                    currentIndex={currentProjectIndex}
                    onNewProject={handleNewProject}
                    onOpenProject={handleOpenProject}
                    onImportProject={handleImportProject}
                    onExportProject={handleExportProject}
                    onModifyProject={handleModifyProject}
                    onModifyProjectState={handleModifyProjectState}
                    onStartMock={handleStartMock}
                    onStopMock={handleStopMock}
                />
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
                    onExportProject={handleExportProject}
                    onCloseProject={handleCloseProject}
                />
                <main className={classes.content}>
                    {!!projects.length &&
                     <Project
                         project={projects[currentProjectIndex]}
                         projectState={projectStates[currentProjectIndex]}
                         index={currentProjectIndex}
                         onModifyProject={handleModifyProject}
                         onModifyProjectState={handleModifyProjectState}
                     />}
                </main>
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
