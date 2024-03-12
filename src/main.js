"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const backupName = "BENKO_NOTES_USER_INPUT";
const openBtn = document.querySelector('[data-type="open"]');
const saveBtn = document.querySelector('[data-type="save"]');
const textarea = document.querySelector('[data-type="contents"]');
const lineNumber = document.querySelector("#line-number");
const colNumber = document.querySelector("#col-number");
window.addEventListener("load", () => {
    if ("serviceworker" in navigator) {
        navigator.serviceWorker.register("./sw.ts");
    }
});
openBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const [fileHandle] = yield window.showOpenFilePicker();
    const file = yield fileHandle.getFile();
    const contents = yield file.text();
    textarea.value = contents;
}));
function getNewFileHandle() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            id: "Benko Notes",
            suggestedName: "Note",
            startIn: "documents",
            types: [
                {
                    description: "Text File",
                    accept: { "text/plain": [] },
                },
                {
                    description: "Markdown",
                    accept: { "text/plain": [] },
                },
            ],
        };
        // @ts-ignore
        return yield window.showSaveFilePicker(options);
    });
}
saveBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const fileHandle = getNewFileHandle();
    const writable = (yield fileHandle).createWritable();
    (yield writable).write(textarea.value);
    (yield writable).close();
}));
function handlePosChange() {
    const pos = checkCaret();
    let parsed = textarea.value.split("\n");
    const parsedLineNumber = parsed.length;
    const parsedColNumber = parsed[parsed.length - 1].length;
    lineNumber.textContent = parsedLineNumber.toString();
    colNumber.textContent = parsedColNumber.toString();
}
let pos = 0;
function checkCaret() {
    const newPos = textarea.selectionStart;
    if (newPos !== pos) {
        console.log("change to " + newPos);
        pos = newPos;
    }
    return pos;
}
textarea.addEventListener("keypress", handlePosChange);
textarea.addEventListener("keyup", handlePosChange);
textarea.addEventListener("mousedown", handlePosChange);
textarea.addEventListener("touchstart", handlePosChange);
textarea.addEventListener("input", () => {
    handlePosChange();
    localStorage.setItem(backupName, textarea.value);
});
textarea.addEventListener("paste", handlePosChange);
textarea.addEventListener("cut", handlePosChange);
textarea.addEventListener("mousemove", handlePosChange);
textarea.addEventListener("select", handlePosChange);
textarea.addEventListener("selectstart", handlePosChange);
if (localStorage.getItem(backupName) != null) {
    textarea.value = localStorage.getItem(backupName) || "";
}
if (localStorage.getItem(backupName) == null)
    localStorage.setItem(backupName, "");
