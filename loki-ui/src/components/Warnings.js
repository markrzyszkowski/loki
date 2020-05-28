import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import { Error } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import WarningsItem from './WarningsItem';
import { flection } from '../util';
import { warningsCount } from '../warnings';

function Warnings(props) {
    const {project, state, index, onModifyState} = props;

    const [showDialog, setShowDialog] = useState(false);

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleNavigateToWarning = tab => {
        const tabIndex = project.tabs.findIndex(t => t.id === tab);

        setShowDialog(false);

        if (tabIndex !== state.activeTab) {
            onModifyState(index, {activeTab: tabIndex});
        }
    };

    const count = warningsCount(state.warnings);

    return (
        <>
            <Chip
                icon={<Error/>}
                label={flection(count, 'warning', 'warnings')}
                onClick={handleOpenDialog}
            />
            <Dialog open={showDialog} scroll="paper" onClose={handleCloseDialog}>
                <DialogTitle>{`Warnings for ${project.name}`}</DialogTitle>
                <DialogContent>
                    <List>
                        {Object.entries(state.warnings)
                               .flatMap(([tab, warnings]) => Object.entries(warnings).map(([_, warning]) =>
                                   <WarningsItem
                                       name={project.tabs.find(t => t.id === tab).name}
                                       tab={tab}
                                       warning={warning}
                                       onNavigateToWarning={handleNavigateToWarning}
                                   />
                               ))}
                    </List>
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

Warnings.propTypes = {
    project: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onModifyState: PropTypes.func.isRequired
};

export default Warnings;
