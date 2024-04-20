const themeSetup = "BENKO_NOTES.THEME";
const themesEl = document.querySelector("#themes") as HTMLDivElement;
const rootElement = document.documentElement;
const themeBoxTemplate = document.querySelector(
  "#theme-box"
) as HTMLTemplateElement;

const themes = [
  { name: "Blue", value: 200 },
  { name: "Green", value: 120 },
  { name: "Red", value: 0 },
];

function generateThemeBoxes() {
  const parentSection = themeBoxTemplate.closest("section") as HTMLDivElement;
  const themeBoxContainer = parentSection.querySelector(
    ".radios"
  ) as HTMLDivElement;

  themes.forEach((theme) => {
    const clone = themeBoxTemplate.content.cloneNode(true) as HTMLDivElement;
    const radioEl = clone.querySelector(
      'input[type="radio"]'
    ) as HTMLInputElement;
    const circleEl = clone.querySelector(".circle") as HTMLInputElement;

    radioEl.setAttribute("value", theme.value.toString());
    radioEl.setAttribute("id", theme.name.toLowerCase());
    if (localStorage.getItem(themeSetup) === radioEl.id) {
      radioEl.setAttribute("checked", "");
    }
    circleEl.classList.remove("colour");
    circleEl.classList.add(theme.name.toLowerCase());

    (clone.querySelector("label") as HTMLLabelElement).setAttribute(
      "for",
      theme.name.toLowerCase()
    );
    (clone.querySelector(".tag") as HTMLDivElement).innerText = theme.name;

    themeBoxContainer.appendChild(clone);
  });

  const themeRadios = themesEl.querySelectorAll(
    'input[type="radio"]'
  ) as NodeListOf<HTMLInputElement>;

  [...themeRadios].forEach((themeRadio) => {
    themeRadio.addEventListener("change", () => {
      localStorage.setItem(themeSetup, themeRadio.id);
      handleTheming();
    });
  });
}

export function handleTheming() {
  if (localStorage.getItem(themeSetup) == null)
    localStorage.setItem(themeSetup, "blue");

  rootElement.style.setProperty("--accent-hue", getCurrentHue());

  function getCurrentHue() {
    return (
      themesEl.querySelector(
        `#${localStorage.getItem(themeSetup)}`
      ) as HTMLInputElement
    ).value;
  }
}

generateThemeBoxes();
