/**
 * Requires the line-height CSS attribute to be set to a number value
 * E.g. 'line-height' can't be set to 'normal'
 */
export const getElementPropertyValue = (element, property) => {
  let propertyStr = window.getComputedStyle(element).getPropertyValue(property);
  return parseFloat(propertyStr);
};
