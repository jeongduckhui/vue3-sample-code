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











const pinned = document.querySelector(
  "#실제그리드ID .ag-pinned-left-cols-viewport"
);

console.log({
  flex: getComputedStyle(pinned).flex,
  flexGrow: getComputedStyle(pinned).flexGrow,
  flexShrink: getComputedStyle(pinned).flexShrink,
  flexBasis: getComputedStyle(pinned).flexBasis,
});













const getRect = (selector) => {
  const element = document.querySelector(
    `#실제그리드ID ${selector}`
  );

  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);

  return {
    left: rect.left,
    width: rect.width,
    inlineStyle: element.getAttribute("style"),
    computedWidth: style.width,
    minWidth: style.minWidth,
    maxWidth: style.maxWidth,
    position: style.position,
    transform: style.transform,
  };
};

console.log({
  pinnedHeader:
    getRect(".ag-pinned-left-header"),

  pinnedViewport:
    getRect(".ag-pinned-left-cols-viewport"),

  pinnedContainer:
    getRect(".ag-pinned-left-cols-container"),

  centerViewport:
    getRect(".ag-center-cols-viewport"),

  centerContainer:
    getRect(".ag-center-cols-container"),
});










const info = (selector) => {
  const element = document.querySelector(
    `#실제그리드ID ${selector}`
  );

  if (!element) {
    return {
      selector,
      exists: false,
    };
  }

  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);

  return {
    selector,
    left: rect.left,
    width: rect.width,
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    display: style.display,
    visibility: style.visibility,
    overflowX: style.overflowX,
  };
};

console.log([
  info(".ag-pinned-left-cols-viewport"),
  info(".ag-center-cols-viewport"),
  info(".ag-center-cols-container"),
  info(".ag-body-horizontal-scroll"),
  info(".ag-body-horizontal-scroll-viewport"),
  info(".ag-body-horizontal-scroll-container"),
  info(".ag-horizontal-left-spacer"),
]);
