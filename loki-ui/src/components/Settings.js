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
import { Settings as SettingsIcon } from '@material-ui/icons';
import * as PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    setting: {
        marginBottom: '10px'
    }
}));

function Settings(props) {
    const {project, index, onChangeSettings} = props;

    const [showDialog, setShowDialog] = useState(false);

    const classes = useStyles();

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleProfileChange = event => {
        const profile = event.target.value;

        onChangeSettings(index, {profile: profile});
    };

    const handlePortChange = event => {
        let port = parseInt(event.target.value);

        if (port > 65535) {
            port = 65535;
        }

        onChangeSettings(index, {port: port});
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleOpenDialog}>
                <SettingsIcon/>
            </IconButton>
            <Dialog open={showDialog} scroll="paper" onClose={handleCloseDialog}>
                <DialogTitle>{`${project.name} settings`}</DialogTitle>
                <DialogContent>
                    <div className={classes.setting}>
                        <FormLabel>Mock profile</FormLabel>
                        <RadioGroup
                            row
                            value={project.settings.profile}
                            name="profile"
                            onChange={handleProfileChange}
                        >
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
                            onChange={handlePortChange}
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

Settings.propTypes = {
    project: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onChangeSettings: PropTypes.func.isRequired
};

export default Settings;
