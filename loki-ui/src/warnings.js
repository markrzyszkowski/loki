function checkWarnings(project, state) {
    validateUrls(project, state.warnings);

    project.tabs.forEach(tab => {
        tab.rules.forEach(rule => {
            validateHttpMethod(rule.request.method, rule.id, state.warnings[tab.id]);

            rule.request.headers.forEach((header, index) => {
                validateHeaderKey(header.key, rule.id, 'request', index, state.warnings[tab.id]);

                if (!header.condition.includes('PRESENT')) {
                    validateHeaderValue(header.value, rule.id, 'request', index, state.warnings[tab.id]);
                }
            });

            rule.request.parameters.forEach((parameter, index) => {
                validateParameterKey(parameter.key, rule.id, index, state.warnings[tab.id]);

                if (!parameter.condition.includes('PRESENT')) {
                    validateParameterValue(parameter.key, rule.id, index, state.warnings[tab.id]);
                }
            });

            if (!rule.request.bodyCondition.includes('PRESENT')) {
                validateBody(rule.request.body, rule.id, state.warnings[tab.id]);
            }

            validateStatusCode(rule.response.statusCode, rule.id, state.warnings[tab.id]);

            rule.response.headers.forEach((header, index) => {
                validateHeaderKey(header.key, rule.id, 'response', index, state.warnings[tab.id]);
                validateHeaderValue(header.value, rule.id, 'response', index, state.warnings[tab.id]);
            });
        });
    });

    return state;
}

function copyWarnings(prefix, ruleId, warnings) {
    Object.entries(warnings)
          .filter(([id]) => id.startsWith(prefix))
          .forEach(([id, warning]) => {
              warnings[id.replace(prefix, ruleId)] = warning;
          });
}

function deleteWarnings(prefix, warnings) {
    Object.keys(warnings)
          .filter(id => id.startsWith(prefix))
          .forEach(id => {
              delete warnings[id];
          });
}

function deleteEmptyWarnings(warnings) {
    Object.entries(warnings)
          .filter(([_, tabWarnings]) => !Object.keys(tabWarnings).length)
          .map(([tabId, _]) => tabId)
          .forEach(id => {
              delete warnings[id];
          });
}

function shiftIndexedWarnings(condition, index, warnings) {
    const regex = new RegExp(`${condition}-(\\d+)`);

    let modified = {};

    Object.entries(warnings)
          .forEach(([id, warning]) => {
              const match = regex.exec(id);

              if (match) {
                  const idx = parseInt(match[1]);

                  if (idx > index) {
                      modified = {...modified, [id.replace(regex, `${condition}-${idx - 1}`)]: warning};
                  } else {
                      modified = {...modified, [id]: warning};
                  }
              } else {
                  modified = {...modified, [id]: warning};
              }
          });

    return modified;
}

function validateUrls(project, warnings) {
    const duplicates = {};

    project.tabs.forEach(tab => {
        validateUrl(tab.url, warnings[tab.id]);

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

function validateUrl(url, warnings) {
    const field = 'url';

    if (isNotEmpty(url)) {
        if (isValidUrl(url)) {
            if (warnings) {
                delete warnings[field];
            }
        } else {
            warnings = warnings || {};
            warnings[field] = 'Mock URL must be valid';
        }
    } else {
        warnings = warnings || {};
        warnings[field] = 'Mock URL cannot be empty';
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

function validateBody(body, ruleId, warnings) {
    const field = `${ruleId}-request-body`;

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

function isNotEmpty(str) {
    return str && str.length;
}

function containsWhitespace(str) {
    return /\s/.test(str);
}

function isValidUrl(str) {
    if (!containsWhitespace(str) && !/^.*:/.test(str)) {
        try {
            new URL(`http://${str}`);
        } catch (_) {
            return false;
        }

        const match = /([^/?]*)([^?]*)(.*)/.exec(str);

        let result = isValidUrlHostAndUserInfo(match[1]);

        if (match[2]) {
            result = result && isValidUrlPath(match[2]);
        }

        if (match[3]) {
            result = result && isValidUrlQuery(match[3]);
        }

        return result;
    }

    return false;
}

function isValidUrlHostAndUserInfo(str) {
    return !/[{}]/.test(str);
}

function isValidUrlPath(str) {
    if (str) {
        const matches = [...str.matchAll(/{{.*?}}/g)];

        for (const match of matches) {
            if (match[0].indexOf('/') !== -1) {
                return false;
            }
        }
    }

    return true;
}

function isValidUrlQuery(str) {
    return !str;
}

function isValidHttpMethod(str) {
    return !containsWhitespace(str);
}

function isValidUrlVariableKey(str) {
    return !containsWhitespace(str);
}

function isValidUrlVariableValue(str) {
    return !containsWhitespace(str);
}

function isValidParameterKey(str) {
    return !containsWhitespace(str);
}

function isValidParameterValue(str) {
    return !containsWhitespace(str);
}

function isValidHeaderKey(str) {
    return !containsWhitespace(str);
}

function isValidHeaderValue(str) {
    return !containsWhitespace(str);
}

function isValidStatusCode(str) {
    const statusCode = parseInt(str);

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

export {
    checkWarnings,
    copyWarnings,
    deleteWarnings,
    shiftIndexedWarnings,
    validators,
    warningsPresent,
    warningsCount
};
