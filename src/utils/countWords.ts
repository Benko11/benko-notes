export function countWords(text: string, delimeters: string[] = [" ", "\n"]) {
  const x = [1, 2, 1];
  const ax = delimeters
    .reduce(
      (acc, delimeter) => {
        return acc.flatMap((text) => text.split(delimeter));
      },
      [text]
    )
    .filter((word) => word !== "");

  return ax.length;
}
