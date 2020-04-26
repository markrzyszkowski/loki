import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import * as PropTypes from 'prop-types';

function ellipsis(text, length) {
    return text.substring(0, length) + '...';
}

function EllipsizeWithTooltip(props) {
    const {text, maxLength, interactive} = props;

    return (
        <>
            {text.length <= maxLength && <div>{text}</div>}
            {text.length > maxLength &&
             <Tooltip title={text} interactive={interactive}>
                 <div>{ellipsis(text, maxLength)}</div>
             </Tooltip>}
        </>
    );
}

EllipsizeWithTooltip.propTypes = {
    text: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired,
    interactive: PropTypes.bool.isRequired
};

export { EllipsizeWithTooltip };
