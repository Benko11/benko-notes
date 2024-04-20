const fontSizeSetup = "BENKO_NOTES.FONT_SIZE";

const fontSizeEl = document.querySelector("#font-size") as HTMLSelectElement;

const textSizes = [
  { name: "Small", size: 11 },
  { name: "Medium", size: "14" },
  { name: "Large", size: "18" },
  { name: "Extra Large", size: "24" },
];

export function handleTextSizing() {
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  const fontSize = getComputedStyle(textarea).getPropertyValue("--font-size");

  if (localStorage.getItem(fontSizeSetup) == null)
    localStorage.setItem(fontSizeSetup, fontSize);

  textarea.style.setProperty(
    "--font-size",
    localStorage.getItem(fontSizeSetup)
  );
}

function generateTextSizeItems() {
  textSizes.forEach((textSize) => {
    const newSize = document.createElement("option");
    newSize.value = textSize.size.toString();
    newSize.innerText = textSize.name;
    fontSizeEl.appendChild(newSize);
  });

  fontSizeEl.addEventListener("change", (e) => {
    const newFontSize = (e.target as HTMLSelectElement).value;
    localStorage.setItem(fontSizeSetup, newFontSize);
    handleTextSizing();
  });
}

generateTextSizeItems();
