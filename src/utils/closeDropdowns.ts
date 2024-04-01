export function closeDropdowns(dropdowns: NodeListOf<HTMLElement>) {
  [...dropdowns].forEach(
    (dropdown) =>
      ((dropdown.nextElementSibling as HTMLElement).dataset.state = "closed")
  );
}
