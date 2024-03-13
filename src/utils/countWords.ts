export function countWords(text: string, delimeters: string[] = [" ", "\n"]) {
  const x = [1, 2, 1];
  const ax = new Set(
    delimeters
      .flatMap((delimeter) => {
        return text.split(delimeter);
      })
      .filter((text) => text !== "")
  );
  return ax.size;
}
