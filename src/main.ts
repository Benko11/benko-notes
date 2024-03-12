const backupName = "BENKO_NOTES_USER_INPUT";

const openBtn = document.querySelector(
  '[data-type="open"]'
) as HTMLButtonElement;
const saveBtn = document.querySelector(
  '[data-type="save"]'
) as HTMLButtonElement;
const textarea = document.querySelector(
  '[data-type="contents"]'
) as HTMLTextAreaElement;
const lineNumber = document.querySelector("#line-number") as HTMLSpanElement;
const colNumber = document.querySelector("#col-number") as HTMLSpanElement;

window.addEventListener("load", () => {
  if ("serviceworker" in navigator) {
    navigator.serviceWorker.register("./sw.ts");
  }
});

openBtn.addEventListener("click", async () => {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  textarea.value = contents;
});

async function getNewFileHandle() {
  const options = {
    id: "Benko Notes",
    suggestedName: "Note",
    startIn: "documents",
    types: [
      {
        description: "Text File",
        accept: { "text/plain": [".txt"] },
      },
      {
        description: "Markdown",
        accept: { "text/plain": [".md"] },
      },
    ],
  };

  return await window.showSaveFilePicker(options);
}

saveBtn.addEventListener("click", async () => {
  const fileHandle = getNewFileHandle();
  const writable = (await fileHandle).createWritable();
  (await writable).write(textarea.value);
  (await writable).close();
});

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
  textarea.value = localStorage.getItem(backupName);
}

if (localStorage.getItem(backupName) == null)
  localStorage.setItem(backupName, "");
