const headers = [
  ...document.querySelectorAll(
    '.ag-header-viewport .ag-header-cell[col-id]'
  ),
];

const results = headers.map(header => {
  const colId = header.getAttribute('col-id');

  const cell = document.querySelector(
    `.ag-center-cols-container .ag-cell[col-id="${colId}"]`
  );

  if (!cell) return null;

  const headerRect = header.getBoundingClientRect();
  const cellRect = cell.getBoundingClientRect();

  return {
    colId,

    headerStyleLeft: header.style.left,
    cellStyleLeft: cell.style.left,

    headerLeft: Math.round(headerRect.left * 100) / 100,
    cellLeft: Math.round(cellRect.left * 100) / 100,
    leftDiff:
      Math.round((cellRect.left - headerRect.left) * 100) / 100,

    headerWidth: Math.round(headerRect.width * 100) / 100,
    cellWidth: Math.round(cellRect.width * 100) / 100,
    widthDiff:
      Math.round((cellRect.width - headerRect.width) * 100) / 100,
  };
}).filter(Boolean);

console.table(results)






const pinnedHeader = document.querySelector('.ag-pinned-left-header');
const pinnedBody = document.querySelector(
  '.ag-pinned-left-cols-container'
);

const headerViewport = document.querySelector('.ag-header-viewport');
const bodyViewport = document.querySelector(
  '.ag-center-cols-viewport'
);

console.table({
  pinnedHeaderWidth:
    pinnedHeader?.getBoundingClientRect().width,

  pinnedBodyWidth:
    pinnedBody?.getBoundingClientRect().width,

  headerViewportLeft:
    headerViewport?.getBoundingClientRect().left,

  bodyViewportLeft:
    bodyViewport?.getBoundingClientRect().left,

  viewportLeftDiff:
    (bodyViewport?.getBoundingClientRect().left ?? 0) -
    (headerViewport?.getBoundingClientRect().left ?? 0),
});







const grid = document.querySelector('#target-grid');

const pinnedHeader = grid.querySelector(
  '.ag-pinned-left-header'
);

const pinnedBody = grid.querySelector(
  '.ag-pinned-left-cols-container'
);

const headerViewport = grid.querySelector(
  '.ag-header-viewport'
);

const bodyViewport = grid.querySelector(
  '.ag-center-cols-viewport'
);

console.table({
  pinnedHeaderWidth:
    pinnedHeader.getBoundingClientRect().width,

  pinnedBodyWidth:
    pinnedBody.getBoundingClientRect().width,

  pinnedWidthDiff:
    pinnedBody.getBoundingClientRect().width -
    pinnedHeader.getBoundingClientRect().width,

  headerViewportLeft:
    headerViewport.getBoundingClientRect().left,

  bodyViewportLeft:
    bodyViewport.getBoundingClientRect().left,

  viewportLeftDiff:
    bodyViewport.getBoundingClientRect().left -
    headerViewport.getBoundingClientRect().left,

  pinnedHeaderInlineWidth: pinnedHeader.style.width,
  pinnedBodyInlineWidth: pinnedBody.style.width,

  pinnedHeaderComputedWidth:
    getComputedStyle(pinnedHeader).width,

  pinnedBodyComputedWidth:
    getComputedStyle(pinnedBody).width,
});








const grid = document.querySelector('#target-grid');

function inspectPath(selector) {
  let element = grid.querySelector(selector);
  const result = [];

  while (element && element !== grid.parentElement) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    result.push({
      element:
        element.className ||
        element.tagName,

      rectLeft: rect.left,
      rectWidth: rect.width,

      inlineLeft: element.style.left,
      inlineWidth: element.style.width,
      inlineTransform: element.style.transform,

      computedLeft: style.left,
      marginLeft: style.marginLeft,
      paddingLeft: style.paddingLeft,
      transform: style.transform,
      translate: style.translate,
      position: style.position,
      display: style.display,
      zoom: style.zoom,
    });

    element = element.parentElement;
  }

  console.table(result);
}

inspectPath('.ag-header-viewport');
inspectPath('.ag-center-cols-viewport');








const bodyViewport = grid.querySelector(
  '.ag-center-cols-viewport'
);

console.log({
  inlineTransform: bodyViewport.style.transform,
  computedTransform:
    getComputedStyle(bodyViewport).transform,

  inlineLeft: bodyViewport.style.left,
  computedLeft:
    getComputedStyle(bodyViewport).left,

  inlineMarginLeft: bodyViewport.style.marginLeft,
  computedMarginLeft:
    getComputedStyle(bodyViewport).marginLeft,
});









const root = grid.querySelector('.ag-root');

console.log({
  pinnedLeftWidth:
    getComputedStyle(root)
      .getPropertyValue('--ag-pinned-left-width'),

  bodyPinnedLeftWidth:
    getComputedStyle(
      grid.querySelector('.ag-body-viewport')
    ).getPropertyValue('--ag-pinned-left-width'),

  centerPinnedLeftWidth:
    getComputedStyle(
      grid.querySelector('.ag-center-cols-viewport')
    ).getPropertyValue('--ag-pinned-left-width'),
});









const grid = document.querySelector('#target-grid');

const header = grid.querySelector('.ag-header-viewport');
const body = grid.querySelector('.ag-center-cols-viewport');
const root = grid.querySelector('.ag-root');

function inspect(element) {
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return {
    rectLeft: rect.left,
    rectWidth: rect.width,

    inlineWidth: element.style.width,
    inlineLeft: element.style.left,
    inlineMarginLeft: element.style.marginLeft,
    inlineTransform: element.style.transform,

    computedWidth: style.width,
    computedLeft: style.left,
    computedMarginLeft: style.marginLeft,
    computedTransform: style.transform,

    flexBasis: style.flexBasis,
    flexShrink: style.flexShrink,
    maxWidth: style.maxWidth,
  };
}

console.log({
  root: inspect(root),
  header: inspect(header),
  body: inspect(body),
});
