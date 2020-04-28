function ellipsis(text, length) {
    return `${text.substring(0, length)}...`;
}

function flection(count, singular, plural) {
    return `${count} ${count > 1 ? plural : singular}`
}

function handleApiError(error, actions) {
    const {setSnackbarContent, setShowSnackbar} = actions;
    if (error.response) {
        console.error('Received agent response with list of errors');
        console.error('Response:', error.response.data);
        setSnackbarContent({severity: 'error', message: error.response.data.errors.join('; ')});
    } else if (error.request) {
        console.error('Request to agent has been sent but no response was received');
        setSnackbarContent({severity: 'error', message: 'Request to agent has been sent but no response was received'});
    } else {
        console.error('Error occured during request creation:', error.message);
        setSnackbarContent({severity: 'error', message: 'Error occured during request creation:'});
    }
    setShowSnackbar(true);
}

export { ellipsis, flection, handleApiError };
