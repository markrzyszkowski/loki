import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Settings } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    setting: {
        marginBottom: '10px'
    }
}));

function ProjectSettings(props) {
    const {project, projectState, index, onModifyProject, onModifyProjectState} = props;

    const [showSettingsDialog, setShowSettingsDialog] = useState(false);

    const classes = useStyles();

    const handleProfileChangeAction = event => {
        const profile = event.target.value;
        onModifyProject(index, {settings: {...project.settings, profile: profile}});
        onModifyProjectState(index, {modified: true});
    };

    const handlePortChangeAction = event => {
        let port = parseInt(event.target.value);

        if (port > 65535) {
            port = 65535;
        }

        onModifyProject(index, {settings: {...project.settings, port: port}});
        onModifyProjectState(index, {modified: true});
    };

    const handleOpenSettingsDialog = () => {
        setShowSettingsDialog(true);
    };

    const handleCloseSettingsDialog = () => {
        setShowSettingsDialog(false);
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleOpenSettingsDialog}>
                <Settings/>
            </IconButton>
            <Dialog open={showSettingsDialog} scroll="paper" onClose={handleCloseSettingsDialog}>
                <DialogTitle>{`${project.name} settings`}</DialogTitle>
                <DialogContent>
                    <div className={classes.setting}>
                        <FormLabel>Mock profile</FormLabel>
                        <RadioGroup row value={project.settings.profile} name="profile" onChange={handleProfileChangeAction}>
                            <FormControlLabel value="STATIC" control={<Radio/>} label="Static"/>
                            <FormControlLabel value="PROXY" control={<Radio/>} label="Proxy"/>
                        </RadioGroup>
                    </div>
                    <div className={classes.setting}>
                        <FormLabel>Mock port</FormLabel>
                        <TextField
                            value={project.settings.port}
                            type="number"
                            inputProps={{min: 0, max: 65535}}
                            onChange={handlePortChangeAction}
                            fullWidth/>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSettingsDialog} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

ProjectSettings.propTypes = {
    project: PropTypes.object.isRequired,
    projectState: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onModifyProject: PropTypes.func.isRequired,
    onModifyProjectState: PropTypes.func.isRequired
};

export default ProjectSettings;
