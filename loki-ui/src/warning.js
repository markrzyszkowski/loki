function checkWarnings(project, state) {
    validateUrls(project, state.warnings);
    return state;
}

function deleteEmptyWarnings(warnings) {
    Object.entries(warnings)
          .filter(([_, tabWarnings]) => !Object.keys(tabWarnings).length)
          .map(([tabId, _]) => tabId)
          .forEach(id => {
              delete warnings[id];
          });
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
                warnings[id] = {...warnings[id]};
                if (!warnings[id]['url']) {
                    warnings[id] = {...warnings[id], url: 'Mock URL must be unique in project scope'};
                }
            });
        }
    }

    deleteEmptyWarnings(warnings);
}

function validateUrl(tab, warnings) {
    if (tab.url && tab.url.length) {
        if (isValidUrl(tab.url)) {
            if (warnings[tab.id]) {
                delete warnings[tab.id]['url'];
            }
        } else {
            warnings[tab.id] = {...warnings[tab.id], url: 'Mock URL must be valid'};
        }
    } else {
        warnings[tab.id] = {...warnings[tab.id], url: 'Mock URL cannot be empty'};
    }
}

function isValidUrl(string) {
    try {
        const url = new URL(`http://${string}`);

        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

const validators = {
    url: validateUrls
};

function warningsPresent(warnings) {
    return Object.entries(warnings).flatMap(([_, tab]) => Object.keys(tab)).length > 0;
}

function warningCount(warnings) {
    return Object.entries(warnings).flatMap(([_, tab]) => Object.keys(tab)).length;
}

export { checkWarnings, validators, warningsPresent, warningsCount };
