[
  ".ag-pinned-left-header",
  ".ag-header-viewport",
  ".ag-body-viewport",
  ".ag-pinned-left-cols-viewport",
  ".ag-center-cols-viewport",
].forEach((selector) => {
  const element = document.querySelector(
    `#target-grid ${selector}`
  );

  if (!element) {
    console.log(selector, "없음");
    return;
  }

  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);

  console.log(selector, {
    left: rect.left,
    width: rect.width,
    display: style.display,
    position: style.position,
    overflowX: style.overflowX,
    transform: style.transform,
    marginLeft: style.marginLeft,
    flex: style.flex,
    flexShrink: style.flexShrink,
  });
});








const pinned = document.querySelector(
  "#실제그리드ID .ag-pinned-left-cols-viewport"
);

const center = document.querySelector(
  "#실제그리드ID .ag-center-cols-viewport"
);

console.log({
  pinnedLeft: pinned.getBoundingClientRect().left,
  pinnedWidth: pinned.getBoundingClientRect().width,
  centerLeft: center.getBoundingClientRect().left,
  centerWidth: center.getBoundingClientRect().width,
});











const getElementInfo = (element) => {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);

  return {
    className: element.className,
    left: rect.left,
    width: rect.width,
    inlineStyle: element.getAttribute("style"),
    display: style.display,
    position: style.position,
    widthStyle: style.width,
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    flex: style.flex,
    flexBasis: style.flexBasis,
    flexGrow: style.flexGrow,
    flexShrink: style.flexShrink,
    overflowX: style.overflowX,
  };
};

const pinned = document.querySelector(
  "#실제그리드ID .ag-pinned-left-cols-viewport"
);

const center = document.querySelector(
  "#실제그리드ID .ag-center-cols-viewport"
);

console.log("pinned", getElementInfo(pinned));
console.log(
  "pinned parent",
  getElementInfo(pinned?.parentElement)
);

console.log("center", getElementInfo(center));
console.log(
  "center parent",
  getElementInfo(center?.parentElement)
);

console.log(
  "같은 부모인가?",
  pinned?.parentElement === center?.parentElement
);
