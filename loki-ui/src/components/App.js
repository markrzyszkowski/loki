import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Initializer from './Initializer';
import Workspace from './Workspace';

import { newProject } from '../project';

function App() {
    const [project, setProject] = useState(null);

    const handleProjectInit = project => {
        setProject(project);
    };

    return (
        <>
            <CssBaseline/>
            {/*{project ? <Workspace initialProject={project}/> : <Initializer onProjectInit={handleProjectInit}/>}*/}
            <Workspace initialProject={newProject()}/>
        </>
    );
}

export default App;
