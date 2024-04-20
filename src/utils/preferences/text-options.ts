const fontSizeSetup = "BENKO_NOTES.FONT_SIZE";

const fontSizeEl = document.querySelector("#font-size") as HTMLSelectElement;

const textSizes = [
  { name: "Small", size: 11 },
  { name: "Medium", size: 14 },
  { name: "Large", size: 18 },
  { name: "Extra Large", size: 24 },
];

export function handleTextSizing() {
  if (localStorage.getItem(fontSizeSetup) == null)
    localStorage.setItem(fontSizeSetup, textSizes[1].name.toLowerCase());

  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  const filteredTextSize = textSizes.filter(
    (size) => size.name.toLowerCase() === localStorage.getItem(fontSizeSetup)
  )[0];
  textarea.style.setProperty("--font-size", filteredTextSize.size.toString());
}

function generateTextSizeItems() {
  textSizes.forEach((textSize) => {
    const newSize = document.createElement("option");
    newSize.value = textSize.size.toString();
    newSize.innerText = textSize.name;
    fontSizeEl.appendChild(newSize);
  });

  fontSizeEl.addEventListener("change", (e) => {
    const newFontSize = parseInt((e.target as HTMLSelectElement).value);
    const newFontSizeName = textSizes
      .filter((textSize) => textSize.size === newFontSize)[0]
      .name.toLowerCase();
    localStorage.setItem(fontSizeSetup, newFontSizeName);
    handleTextSizing();
  });
}

generateTextSizeItems();
