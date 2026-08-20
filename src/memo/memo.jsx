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












const fixedFields = [
  "tech",
  "fab",
  "product",
];

let lastStickyKey = null;

const handleBodyScroll = (event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const api = event.api;
  const firstRowIndex = api.getFirstDisplayedRowIndex();

  console.log("현재 첫 번째 표시 행:", firstRowIndex);

  if (firstRowIndex <= 0) {
    lastStickyKey = null;
    api.setGridOption("pinnedTopRowData", []);
    return;
  }

  const firstRowNode =
    api.getDisplayedRowAtIndex(firstRowIndex);

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







const onGridReady = (params) => {
  params.api.addEventListener(
    "bodyScroll",
    handleBodyScroll
  );

  // 기존 onGridReady 로직
  requestAnimationFrame(() => {
    params.api.doLayout();
  });
};





const onGridPreDestroyed = (params) => {
  params.api.removeEventListener(
    "bodyScroll",
    handleBodyScroll
  );
};







const gridApiRef = useRef(null);

const onGridReady = (params) => {
  gridApiRef.current = params.api;

  params.api.addEventListener(
    "bodyScroll",
    handleBodyScroll
  );
};

useEffect(() => {
  return () => {
    gridApiRef.current?.removeEventListener(
      "bodyScroll",
      handleBodyScroll
    );
  };
}, []);





const getStickyValue = (api, startRowIndex, field) => {
  for (
    let rowIndex = startRowIndex;
    rowIndex >= 0;
    rowIndex--
  ) {
    const rowNode =
      api.getDisplayedRowAtIndex(rowIndex);

    const value = rowNode?.data?.[field];

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      return value;
    }
  }

  return "";
};











const handleBodyScroll = (event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const api = event.api;
  const firstRowIndex =
    api.getFirstDisplayedRowIndex();

  if (firstRowIndex <= 0) {
    lastStickyKey = null;

    api.setGridOption(
      "pinnedTopRowData",
      []
    );

    return;
  }

  const stickyRow = {};

  fixedFields.forEach((field) => {
    stickyRow[field] = getStickyValue(
      api,
      firstRowIndex,
      field
    );
  });

  const stickyKey = fixedFields
    .map((field) => stickyRow[field])
    .join("|");

  if (stickyKey === lastStickyKey) {
    return;
  }

  lastStickyKey = stickyKey;

  api.setGridOption(
    "pinnedTopRowData",
    [stickyRow]
  );
};





