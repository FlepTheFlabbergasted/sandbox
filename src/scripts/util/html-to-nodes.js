// Original code from: https://stackoverflow.com/a/35385518/11763719

/**
 * @param string HTML string representing a single node (which might be an Element, a text node, or a comment).
 *
 * @example
 * const td = htmlToNode('<td>foo</td>');
 * const div = htmlToNode('<div><span>nested</span> <span>stuff</span></div>');
 *
 * @returns Node
 */
export function htmlToNode(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const nNodes = template.content.childNodes.length;

  if (nNodes !== 1) {
    throw new Error(
      `html parameter must represent a single node; got ${nNodes}. ` +
        'Note that leading or trailing spaces around an element in your ' +
        'HTML, like " <img/> ", get parsed as text nodes neighbouring ' +
        'the element; call .trim() on your input to avoid this.'
    );
  }

  return template.content.firstChild;
}

/**
 * @param string HTML string representing any number of sibling nodes
 *
 * @example
 * const rows = htmlToNodes('<tr><td>foo</td></tr><tr><td>bar</td></tr>');
 *
 * @returns NodeList
 */
export const htmlToNodes = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html;

  return template.content.childNodes;
};
