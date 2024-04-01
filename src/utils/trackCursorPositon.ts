export function trackCursorPosition(
  textarea: HTMLTextAreaElement,
  handler: () => void
) {
  const events = [
    "keypress",
    "keyup",
    "click",
    "touchstart",
    "paste",
    "cut",
    "mousemove",
    "select",
    "selectstart",
    "input",
  ];

  events.forEach((event) => textarea.addEventListener(event, handler));
}
