function ellipsis(text, length) {
    return `${text.substring(0, length)}...`;
}

function flection(count, singular, plural) {
    return `${count} ${count > 1 ? plural : singular}`
}

function handleApiError(error, alert) {
    if (error.response) {
        console.error('Received agent response with list of errors');
        console.error('Response:', error.response.data);

        alert.show('error', error.response.data.errors.join('; '));
    } else if (error.request) {
        console.error('Request to agent has been sent but no response was received');

        alert.show('error', 'Error occured while trying to communicate with agent service');
    } else {
        console.error('Request creation failed:', error.message);

        alert.show('error', 'Unknown error occured');
    }
}

export { ellipsis, flection, handleApiError };
