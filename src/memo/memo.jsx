const fixedFields = [
  "tech",
  "fab",
  "product"
];

let lastStickyKey = null;

const onBodyScroll = (params) => {
  if (params.direction !== "vertical") {
    return;
  }

  const api = params.api;
  const firstRowIndex = api.getFirstDisplayedRowIndex();
  const firstRowNode = api.getDisplayedRowAtIndex(firstRowIndex);

  if (!firstRowNode?.data) {
    return;
  }

  const currentRow = firstRowNode.data;

  const stickyKey = fixedFields
    .map((field) => currentRow[field])
    .join("|");

  // 같은 병합 그룹 안에서 스크롤하는 동안에는 갱신하지 않음
  if (stickyKey === lastStickyKey) {
    return;
  }

  lastStickyKey = stickyKey;

  const stickyRow = {};

  fixedFields.forEach((field) => {
    stickyRow[field] = currentRow[field];
  });

  // 동적 컬럼 값은 빈 값으로 표시
  api.getColumns().forEach((column) => {
    const field = column.getColDef().field;

    if (field && !fixedFields.includes(field)) {
      stickyRow[field] = null;
    }
  });

  api.setGridOption("pinnedTopRowData", [stickyRow]);
};













const onBodyScroll = (params) => {
  if (params.direction !== "vertical") {
    return;
  }

  const api = params.api;
  const firstRowIndex = api.getFirstDisplayedRowIndex();

  if (firstRowIndex <= 0) {
    lastStickyKey = null;
    api.setGridOption("pinnedTopRowData", []);
    return;
  }

  const firstRowNode = api.getDisplayedRowAtIndex(firstRowIndex);

  if (!firstRowNode?.data) {
    return;
  }

  const currentRow = firstRowNode.data;

  const stickyKey = fixedFields
    .map((field) => currentRow[field])
    .join("|");

  if (stickyKey === lastStickyKey) {
    return;
  }

  lastStickyKey = stickyKey;

  const stickyRow = {};

  fixedFields.forEach((field) => {
    stickyRow[field] = currentRow[field];
  });

  api.setGridOption("pinnedTopRowData", [stickyRow]);
};





const defaultColDef = {
  cellClassRules: {
    "sticky-empty-cell": (params) => {
      return (
        params.node.rowPinned === "top" &&
        !fixedFields.includes(params.colDef.field)
      );
    },
  },
};






.ag-row-pinned .sticky-empty-cell {
  background: transparent;
  border-right: none;
}
