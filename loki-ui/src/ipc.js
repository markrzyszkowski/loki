function dummyIpc() {
    return {
        send: (channel, ...args) => {
            console.log(`Sent message to channel ${channel}`);
        },
        once: (channel, listener) => {
            console.log(`Registering one time listener for ${channel} channel`);
        },
        on: (channel, listener) => {
            console.log(`Registering continuous listener for ${channel} channel`);
        },
        isDummy: true
    };
}

const ipc = window && window.process && window.process.type ? window.require('electron').ipcRenderer : dummyIpc();

export default ipc;
