const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const LLM = require('llama-node');
const LLamaCpp = require('llama-node/dist/llm/llama-cpp.cjs');
const config = {
    modelPath: '',
    enableLogging: true,
    nCtx: 1024,
    seed: 0,
    f16Kv: false,
    logitsAll: false,
    vocabOnly: false,
    useMlock: false,
    embedding: false,
    useMmap: true,
    nGpuLayers: 0
}

const params = {
    nThreads: 4,
    nTokPredict: 9000,
    topK: 40,
    topP: 0.1,
    temp: 0.2,
    repeatPenalty: 1,
    prompt: ''
};

function handleSetModel(event, value) {
    console.log(value);
    config.modelPath = path.resolve(process.cwd(), value);
}

async function handleSetAnswer(event, value) {
    console.log(value);
    const webContent = event.sender;
    const win = BrowserWindow.fromWebContents(webContent);
    const llm = new LLM.LLM(LLamaCpp.LLamaCpp);
    params.prompt = value;

    await llm.load(config);
    let text = '';
    await llm.createCompletion(params, (response) => {
        text += response.token;
        win.webContents.send('reply', text);
    })
}

async function handleSetAnswerFromFile(event, value) {
    console.log(value);
    const fileContents = fs.readFileSync(value).toString();
    const webContent = event.sender;
    const win = BrowserWindow.fromWebContents(webContent);
    const llm = new LLM.LLM(LLamaCpp.LLamaCpp);
    params.prompt = fileContents;

    await llm.load(config);
    let text = '';
    await llm.createCompletion(params, (response) => {
        text += response.token;
        win.webContents.send('reply', text);
    })
}

function createWindow() {
    const mainWin = new BrowserWindow({
        width: 1600,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    });
    mainWin.loadFile(`${__dirname}/index.html`);
    mainWin.webContents.openDevTools();
}

app.whenReady().then(() => {
    ipcMain.on('answer', handleSetAnswer);
    ipcMain.on('answer-file', handleSetAnswerFromFile);
    ipcMain.on('model', handleSetModel);
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })

    app.on('window-all-closed', () => {
        if (process.platform != 'darwin') {
            processes.forEach(function (proc) {
                proc.kill();
            });

            app.quit();
        }
    })
    app.on('close', () => {
        app.des
    })
})

