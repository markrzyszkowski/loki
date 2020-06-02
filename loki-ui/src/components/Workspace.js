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
import { checkWarnings } from '../warnings';

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
    const {initialProject, backdrop, alert} = props;

    const [projects, setProjects] = useState([{
        project: initialProject,
        state: checkWarnings(initialProject, defaultState())
    }]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const classes = useStyles();

    const handleShortcutKeyDown = (_, event) => {
        event.preventDefault();
    };

    const handleShortcutKeyUp = () => {
        handleSaveProject(currentIndex);
    };

    const handleNewProject = () => {
        const project = defaultProject();

        setProjects([...projects, {
            project: project,
            state: checkWarnings(project, defaultState())
        }]);
        setCurrentIndex(projects.length);
    };

    const handleOpenProject = () => {
        const getProjectIndex = newProject => {
            return projects.findIndex(prj => prj.project.id === newProject.id);
        };

        const isAlreadyOpen = newProject => {
            return getProjectIndex(newProject) !== -1;
        };

        ipc.once('open-project', (_, path) => {
            if (path) {
                openProject(path).then(project => {
                    if (isAlreadyOpen(project)) {
                        setCurrentIndex(getProjectIndex(project));
                    } else {
                        const state = {...defaultState(), neverSaved: false, path: path};

                        setProjects([...projects, {
                            project: project,
                            state: checkWarnings(project, state)
                        }]);
                        setCurrentIndex(projects.length);
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
        ipc.once('import-project', (_, path) => {
            if (path) {
                importProject(path).then(project => {
                    const state = {...defaultState(), path: path};

                    setProjects([...projects, {
                        project: project,
                        state: checkWarnings(project, state)
                    }]);
                    setCurrentIndex(projects.length);
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

    const handleModifyProjectAndState = (index, projectProperties, stateProperties) => {
        const projectsCopy = [...projects];
        projectsCopy[index].project = {...projectsCopy[index].project, ...projectProperties};
        projectsCopy[index].state = {...projectsCopy[index].state, ...stateProperties};

        setProjects(projectsCopy);
    };

    const handleModifyState = (index, properties) => {
        const projectsCopy = [...projects];
        projectsCopy[index].state = {...projectsCopy[index].state, ...properties};

        setProjects(projectsCopy);
    };

    const handleSelectProject = index => {
        setCurrentIndex(index);
    };

    const handleSaveProject = index => {
        if (projects.length) {
            const state = projects[index].state;

            if (state.modified || state.neverSaved) {
                const save = path => {
                    saveProject(path, projects[index].project).then(() => {
                        handleModifyState(index, {modified: false, neverSaved: false, path: path});
                    }).catch(error => {
                        handleApiError(error, alert);
                    });
                };

                if (state.neverSaved) {
                    ipc.once('save-project', (_, path) => {
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
                    save(state.path);
                }
            }
        }
    };

    const handleDuplicateProject = index => {
        const projectCopy = {...projects[index].project};

        setProjects([...projects, {
            project: {...projectCopy, id: uuid(), name: `Copy of ${projectCopy.name}`},
            state: defaultState()
        }]);
        setCurrentIndex(projects.length);
    };

    const handleExportProject = index => {
        ipc.once('export-project', (_, path) => {
            if (path) {
                exportProject(path, projects[index].project).catch(error => {
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
            if (projects[index].state.running) {
                stopMock(projects[index].project).catch(error => {
                    handleApiError(error, alert);
                });
            }

            setProjects(projects.filter((_, idx) => idx !== index));

            if (index === currentIndex && index === 0) {
                setCurrentIndex(0);
            } else if (index <= currentIndex) {
                setCurrentIndex(currentIndex - 1);
            }
        }
    };

    const handleStartMock = index => {
        handleModifyState(index, {waiting: true});

        startMock(projects[index].project).then(configuration => {
            handleModifyState(index, {
                running: true,
                waiting: false,
                port: configuration.port,
                urls: configuration.urls
            });
        }).catch(error => {
            handleApiError(error, alert);
            handleModifyState(index, {waiting: false});
        });
    };

    const handleStopMock = index => {
        handleModifyState(index, {waiting: true});

        stopMock(projects[index].project).catch(error => {
            handleApiError(error, alert);
        }).finally(() => {
            handleModifyState(index, {running: false, waiting: false});
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
                    currentIndex={currentIndex}
                    onNewProject={handleNewProject}
                    onOpenProject={handleOpenProject}
                    onImportProject={handleImportProject}
                    onExportProject={handleExportProject}
                    onModifyProjectAndState={handleModifyProjectAndState}
                    onModifyState={handleModifyState}
                    onStartMock={handleStartMock}
                    onStopMock={handleStopMock}
                />
                <Sidebar
                    projects={projects}
                    currentIndex={currentIndex}
                    width={sidebarWidth}
                    onSelectProject={handleSelectProject}
                    onModifyProjectAndState={handleModifyProjectAndState}
                    onSaveProject={handleSaveProject}
                    onDuplicateProject={handleDuplicateProject}
                    onExportProject={handleExportProject}
                    onCloseProject={handleCloseProject}
                />
                <main className={classes.content}>
                    {!!projects.length &&
                     <Project
                         project={projects[currentIndex].project}
                         state={projects[currentIndex].state}
                         index={currentIndex}
                         onModifyProjectAndState={handleModifyProjectAndState}
                         onModifyState={handleModifyState}
                     />}
                </main>
            </div>
        </Hotkeys>
    );
}

Workspace.propTypes = {
    initialProject: PropTypes.object.isRequired,
    backdrop: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired
};

export default Workspace;
