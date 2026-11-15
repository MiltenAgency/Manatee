// Animate transforms between measured rectangles. The final layout is supplied
// by CSS, so text stays crisp and resize never depends on cached coordinates.
export function morphFrom(origin, element) {
  const from = origin.getBoundingClientRect();
  const to = element.getBoundingClientRect();
  return {
    x: from.left - to.left,
    y: from.top - to.top,
    scaleX: from.width / Math.max(to.width, 1),
    scaleY: from.height / Math.max(to.height, 1),
    transformOrigin: 'top left',
  };
}

export function morphTo(element, destination) {
  // offset dimensions are the untransformed CSS size, including when the user
  // closes midway through the opening animation.
  const current = element.getBoundingClientRect();
  const target = destination.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const matrix = !style.transform || style.transform === 'none' ? null : new window.DOMMatrixReadOnly(style.transform);
  const x = matrix?.m41 ?? 0;
  const y = matrix?.m42 ?? 0;
  return {
    x: target.left - (current.left - x),
    y: target.top - (current.top - y),
    scaleX: target.width / Math.max(element.offsetWidth, 1),
    scaleY: target.height / Math.max(element.offsetHeight, 1),
    transformOrigin: 'top left',
  };
}
