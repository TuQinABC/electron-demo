const modelBtn = document.getElementById('modelBtn');
const promptBtn = document.getElementById('promptBtn');
const promptFileBtn = document.getElementById('promptFileBtn');
const model = document.getElementById('model');
const prompt = document.getElementById('prompt');
const promptFile = document.getElementById('promptFile');
const answerTxt = document.getElementById('answer');

modelBtn.addEventListener('click', () => {
    window.castorIpc.setModel(model.value);
})
promptBtn.addEventListener('click', () => {
    window.castorIpc.setAnswer(prompt.value);
})
promptFileBtn.addEventListener('click', () => {
    window.castorIpc.setAnswerFromFile(promptFile.value);
})
window.castorIpc.setResponse((value) => {
    answerTxt.innerHTML = value;
})