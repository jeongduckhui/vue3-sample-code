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
