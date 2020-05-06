function checkWarnings(project, state) {
    validateUrls(project, state.warnings);
    return state;
}

function validateUrls(project, warnings) {
    const duplicates = {};

    project.tabs.forEach(tab => {
        validateUrl(tab, warnings);

        duplicates[tab.url] = duplicates[tab.url] || [];
        duplicates[tab.url].push(tab.id);
    });

    for (let url in duplicates) {
        if (duplicates[url].length > 1) {
            duplicates[url].forEach(id => {
                if (!warnings[id]['url']) {
                    warnings[id] = {...warnings[id], url: 'Mock URL must be unique in project scope'};
                }
            });
        }
    }
}

function validateUrl(tab, warnings) {
    if (tab.url && tab.url.length) {
        if (isValidUrl(tab.url)) {
            delete warnings[tab.id]['url'];
        } else {
            warnings[tab.id] = {...warnings[tab.id], url: 'Mock URL must be valid'};
        }
    } else {
        warnings[tab.id] = {...warnings[tab.id], url: 'Mock URL cannot be empty'};
    }
}

function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

const validators = {
    url: validateUrls
};

export { checkWarnings, validators };
