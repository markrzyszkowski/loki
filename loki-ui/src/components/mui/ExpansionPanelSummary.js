import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';

export default withStyles({
    root: {
        marginBottom: -1,
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        '&$expanded': {
            minHeight: 48
        },
        backgroundColor: 'rgba(0, 0, 0, .05)'
    },
    content: {
        '&$expanded': {
            marginTop: 12,
            marginBottom: 12
        }
    },
    expanded: {}
})(ExpansionPanelSummary);
