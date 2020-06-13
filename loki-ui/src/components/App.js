import React, { useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Initializer from './Initializer';
import Workspace from './Workspace';
import Alert from './util/Alert';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 2
    }
}));

function App() {
    const [project, setProject] = useState(null);
    const [state, setState] = useState(null);
    const [backdrop, setBackdrop] = useState({
        open: false,
        show: () => setBackdrop(current => ({...current, open: true})),
        hide: () => setBackdrop(current => ({...current, open: false}))
    });
    const [alert, setAlert] = useState({
        open: false,
        severity: 'info',
        message: '',
        show: (severity, message) => setAlert(current => ({
            ...current,
            open: true,
            severity: severity,
            message: message
        })),
        hide: () => setAlert(current => ({...current, open: false}))
    });

    const classes = useStyles();

    const handleProjectInit = project => {
        setProject(project);
    };

    return (
        <>
            <CssBaseline/>
            {project && <Workspace initialProject={project} backdrop={backdrop} alert={alert}/>}
            {!project && <Initializer backdrop={backdrop} alert={alert} onProjectInit={handleProjectInit}/>}
            <Backdrop open={backdrop.open} className={classes.backdrop}/>
            <Alert alert={alert}/>
        </>
    );
}

export default App;
