import { DropdownState } from "./types/DropdownState";
import { closeDropdowns } from "./utils/closeDropdowns";
import { countWords } from "./utils/countWords";
import { handleTextSizing } from "./utils/text-options";
import { handleTheming } from "./utils/theming";
import { trackCursorPosition } from "./utils/trackCursorPosition";

const backupName = "BENKO_NOTES.USER_INPUT";

handleTheming();
handleTextSizing();

const openBtn = document.querySelector(
  '[data-type="open"]'
) as HTMLButtonElement;
const saveBtn = document.querySelector(
  '[data-type="save"]'
) as HTMLButtonElement;
const saveCopyBtn = document.querySelector(
  '[data-type="save-copy"]'
) as HTMLButtonElement;
const textarea = document.querySelector(
  '[data-type="contents"]'
) as HTMLTextAreaElement;
const preferencesBtn = document.querySelector(
  '[data-type="preferences"]'
) as HTMLButtonElement;
const preferencesModal = document.querySelector(
  "dialog.preferences"
) as HTMLDialogElement;
const lineNumber = document.querySelector("#line-number") as HTMLSpanElement;
const colNumber = document.querySelector("#col-number") as HTMLSpanElement;
const countWordsEl = document.querySelector("#count-words") as HTMLSpanElement;
const dropdowns = document.querySelectorAll(
  '[data-trigger="dropdown"]'
) as NodeListOf<HTMLDivElement>;
const currentFileName = document.getElementById(
  "current-file-name"
) as HTMLSpanElement;
const fileNameInput = document.getElementById("file-name") as HTMLInputElement;

[...dropdowns].forEach((dropdown) => {
  dropdown.addEventListener("click", () => {
    const nearestDropdown = dropdown.nextElementSibling as HTMLDivElement;
    const currentState = nearestDropdown.dataset.state as DropdownState;
    const newState: DropdownState = currentState === "open" ? "closed" : "open";
    nearestDropdown.dataset.state = newState;
  });
});

function handleCloseDropdowns(e: MouseEvent) {
  if (e.target == null) return;

  const closest = (e.target as HTMLElement).closest(
    ".dropdown-list"
  ) as HTMLDivElement;
  const findButton = (e.target as HTMLElement).closest("button");
  if (closest == null && findButton == null) {
    closeDropdowns(dropdowns);
  }
}

document.body.addEventListener("click", handleCloseDropdowns, {
  capture: true,
});

window.addEventListener("load", () => {
  if ("serviceworker" in navigator) {
    navigator.serviceWorker.register("./sw.ts");
  }
});

preferencesBtn.addEventListener("click", () => {
  preferencesModal.showModal();
});

preferencesModal.addEventListener(
  "click",
  (e) => {
    if ((e.target as HTMLElement).classList.contains("btn-fill")) {
      preferencesModal.close();
    }
  },
  { capture: true }
);

openBtn.addEventListener("click", async () => {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  textarea.value = contents;
  globalFileHandle = fileHandle;
  updateFileName(fileHandle.name);
});

async function getNewFileHandle(name: string = "Note") {
  const options = {
    id: "benko-notes",
    suggestedName: name,
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
  return await window.showSaveFilePicker(options);
}
saveBtn.addEventListener("click", saveFile);
saveCopyBtn.addEventListener("click", saveFile);

let globalFileHandle: FileSystemFileHandle;

async function saveFile() {
  if (globalFileHandle == null)
    globalFileHandle = await getNewFileHandle(fileNameInput.value);

  const writable = await globalFileHandle.createWritable();

  await writable.write(textarea.value);
  await writable.close();
}

async function saveFileAs() {
  const fileHandle = await getNewFileHandle(fileNameInput.value);
  const writable = await fileHandle.createWritable();

  await writable.write(textarea.value);
  await writable.close();
  globalFileHandle = fileHandle;
}

function handlePosChange() {
  const pos = checkCaret();
  const parsed = textarea.value.substring(0, pos).split("\n");
  const parsedLineNumber = parsed.length;
  const parsedColNumber = parsed[parsed.length - 1].length;
  lineNumber.textContent = parsedLineNumber.toString();
  colNumber.textContent = parsedColNumber.toString();

  const count = countWords(textarea.value);
  countWordsEl.textContent = count.toString();
}

function updateFileName(filename: string) {
  currentFileName.textContent = filename;
  fileNameInput.value = filename;
}

updateFileName("Untitled");
fileNameInput.addEventListener("input", (e) => {
  if (e.currentTarget == null) return;
  updateFileName((e.currentTarget as HTMLInputElement).value);
});

let pos = 0;
function checkCaret() {
  const newPos = textarea.selectionStart;
  if (newPos !== pos) {
    pos = newPos;
  }
  return pos;
}

trackCursorPosition(textarea, handlePosChange);

textarea.addEventListener("input", () => {
  localStorage.setItem(backupName, textarea.value);
});

if (localStorage.getItem(backupName) != null)
  textarea.value = localStorage.getItem(backupName) || "";

if (localStorage.getItem(backupName) == null)
  localStorage.setItem(backupName, "");
