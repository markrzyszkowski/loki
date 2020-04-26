import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Initializer from './Initializer';
import Workspace from './Workspace';

import { newProject } from '../project';

function App() {
    const [ready, setReady] = useState(false);
    const [project, setProject] = useState({});

    const handleProjectInit = project => {
        setProject(project);
        setReady(true);
    };

    return (
        <>
            <CssBaseline/>
            {/*{ready ? <Workspace initialProject={project}/> : <Initializer onProjectInit={handleProjectInit}/>}*/}
            <Workspace initialProject={newProject()}/>
        </>
    );
}

export default App;
