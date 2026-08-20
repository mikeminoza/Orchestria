export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// Applied wherever rich text content is rendered (editable canvas and public
// form) so links are visually distinguishable from plain text.
export const RICH_TEXT_LINK_CLASS =
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:no-underline";
