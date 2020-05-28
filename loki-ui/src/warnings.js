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
                warnings[id] = warnings[id] || {};
                if (!warnings[id]['url']) {
                    warnings[id]['url'] = 'Mock URL must be unique in project scope';
                }
            });
        }
    }

    deleteEmptyWarnings(warnings);
}

function validateUrl(tab, warnings) {
    const field = 'url';

    if (isNotEmpty(tab.url)) {
        if (isValidUrl(tab.url)) {
            if (warnings[tab.id]) {
                delete warnings[tab.id]['url'];
            }
        } else {
            warnings[tab.id] = warnings[tab.id] || {};
            warnings[tab.id][field] = 'Mock URL must be valid';
        }
    } else {
        warnings[tab.id] = warnings[tab.id] || {};
        warnings[tab.id][field] = 'Mock URL cannot be empty';
    }
}

function validateHttpMethod(method, ruleId, warnings) {
    const field = `${ruleId}-request-method`;

    if (isNotEmpty(method)) {
        if (isValidHttpMethod(method)) {
            if (warnings) {
                delete warnings[field];
            }
        } else {
            warnings = warnings || {};
            warnings[field] = 'HTTP method must be valid';
        }
    } else {
        warnings = warnings || {};
        warnings[field] = 'HTTP method cannot be empty';
    }
}

function validateParameterKey(key, ruleId, index, warnings) {
    const field = `${ruleId}-request-parameter-${index}-key`;

    if (isNotEmpty(key)) {
        if (isValidParameterKey(key)) {
            if (warnings) {
                delete warnings[field];
            }
        } else {
            warnings = warnings || {};
            warnings[field] = 'Parameter key must be valid';
        }
    } else {
        warnings = warnings || {};
        warnings[field] = 'Parameter key cannot be empty';
    }
}

function validateParameterValue(value, ruleId, index, warnings) {
    const field = `${ruleId}-request-parameter-${index}-value`;

    if (isNotEmpty(value)) {
        if (isValidParameterValue(value)) {
            if (warnings) {
                delete warnings[field];
            }
        } else {
            warnings = warnings || {};
            warnings[field] = 'Parameter value must be valid';
        }
    } else {
        warnings = warnings || {};
        warnings[field] = 'Parameter value cannot be empty';
    }
}

function validateHeaderKey(key, ruleId, rqrs, index, warnings) {
    const field = `${ruleId}-${rqrs}-header-${index}-key`;

    if (isNotEmpty(key)) {
        if (isValidHeaderKey(key)) {
            if (warnings) {
                delete warnings[field];
            }
        } else {
            warnings = warnings || {};
            warnings[field] = 'Header key must be valid';
        }
    } else {
        warnings = warnings || {};
        warnings[field] = 'Header key cannot be empty';
    }
}

function validateHeaderValue(value, ruleId, rqrs, index, warnings) {
    const field = `${ruleId}-${rqrs}-header-${index}-value`;

    if (isNotEmpty(value)) {
        if (isValidHeaderValue(value)) {
            if (warnings) {
                delete warnings[field];
            }
        } else {
            warnings = warnings || {};
            warnings[field] = 'Header value must be valid';
        }
    } else {
        warnings = warnings || {};
        warnings[field] = 'Header value cannot be empty';
    }
}

function validateBody(body, ruleId, rqrs, warnings) {
    const field = `${ruleId}-${rqrs}-body`;

    if (isNotEmpty(body)) {
        if (warnings) {
            delete warnings[field];
        }
    } else {
        warnings = warnings || {};
        warnings[field] = 'Body cannot be empty';
    }
}

function validateStatusCode(statusCode, ruleId, warnings) {
    const field = `${ruleId}-response-statusCode`;

    if (isNotEmpty(statusCode)) {
        if (isValidStatusCode(statusCode)) {
            if (warnings) {
                delete warnings[field];
            }
        } else {
            warnings = warnings || {};
            warnings[field] = 'Status code must be valid';
        }
    } else {
        warnings = warnings || {};
        warnings[field] = 'Status code cannot be empty';
    }
}

function isNotEmpty(string) {
    return string && string.length;
}

function containsWhitespace(string) {
    return /\s/.test(string);
}

function isValidUrl(string) {
    try {
        const url = new URL(`http://${string}`);

        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function isValidHttpMethod(string) {
    return !containsWhitespace(string);
}

function isValidParameterKey(string) {
    return !containsWhitespace(string);
}

function isValidParameterValue(string) {
    return !containsWhitespace(string);
}

function isValidHeaderKey(string) {
    return !containsWhitespace(string);
}

function isValidHeaderValue(string) {
    return !containsWhitespace(string);
}

function isValidStatusCode(string) {
    const statusCode = parseInt(string);

    return statusCode >= 100 && statusCode <= 599;
}

const validators = {
    url: validateUrls,
    httpMethod: validateHttpMethod,
    parameterKey: validateParameterKey,
    parameterValue: validateParameterValue,
    headerKey: validateHeaderKey,
    headerValue: validateHeaderValue,
    body: validateBody,
    statusCode: validateStatusCode
};

function warningsPresent(warnings) {
    return warningsCount(warnings) > 0;
}

function warningsCount(warnings) {
    return Object.entries(warnings).flatMap(([_, tab]) => Object.keys(tab)).length;
}

export { checkWarnings, validators, warningsPresent, warningsCount };
