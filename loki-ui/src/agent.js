import ipc from './ipc';

let agentPort = 8080;

ipc.once('agent-port', (event, port) => {
    agentPort = port;
});

ipc.send('agent-port');

export { agentPort };
