const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("castorIpc", {
    setModel: (value) => ipcRenderer.send('model', value),
    setAnswer: (value) => ipcRenderer.send('answer', value),
    setAnswerFromFile: (value) => ipcRenderer.send('answer-file', value),
    setResponse: (callback) => ipcRenderer.on('reply', (_event, value) => callback(value))
});