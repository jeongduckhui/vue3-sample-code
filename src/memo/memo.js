
const freezeRows = (params) => {
  const api = params.api;
  const allRows = originalRowDataRef.current;

  let realRowIndex;

  // 이미 고정된 행을 클릭한 경우
  if (params.node.rowPinned === "top") {
    realRowIndex = params.node.rowIndex;
  } else {
    const pinnedCount = api.getPinnedTopRowCount();
    realRowIndex = params.node.rowIndex + pinnedCount;
  }

  const pinnedRows = allRows.slice(0, realRowIndex + 1);
  const normalRows = allRows.slice(realRowIndex + 1);

  api.setGridOption("pinnedTopRowData", pinnedRows);
  api.setGridOption("rowData", normalRows);
};



const unfreezeRows = (params) => {

  const api = params.api;

  // 행 고정 해제
  api.setGridOption("pinnedTopRowData", []);

  // 원본 데이터 복구
  api.setGridOption("rowData", originalRowDataRef.current);

};


const freezeRows = (params) => {

  const api = params.api;

  const rowIndex = params.node.rowIndex;

  const allRows = originalRowDataRef.current;

  const pinnedRows = allRows.slice(0, rowIndex + 1);
  const normalRows = allRows.slice(rowIndex + 1);

  api.setGridOption("pinnedTopRowData", pinnedRows);
  api.setGridOption("rowData", normalRows);

};



const setZoom = (scale) => {

  const el = document.getElementById("zoom-container");

  if (!el) return;

  el.style.transform = `scale(${scale})`;
  el.style.transformOrigin = "top left";
};



const unfreezePane = (params) => {

  const api = params.api;

  /*
   * 행 고정 해제
   */

  const pinnedCount = api.getPinnedTopRowCount();

  const pinnedRows = [];

  for (let i = 0; i < pinnedCount; i++) {
    pinnedRows.push(api.getPinnedTopRow(i).data);
  }

  const normalRows = [];

  api.forEachNode(node => {
    normalRows.push(node.data);
  });

  api.setGridOption("pinnedTopRowData", []);
  api.setGridOption("rowData", [...pinnedRows, ...normalRows]);

  /*
   * 열 고정 해제
   */

  const displayedColumns = api.getAllDisplayedColumns();

  const reset = displayedColumns.map(col => ({
    colId: col.getColId(),
    pinned: null
  }));

  api.applyColumnState({
    state: reset
  });

};


const freezePane = (params) => {

  const api = params.api;

  const rowIndex = params.node.rowIndex;
  const targetColId = params.column.getColId();

  /*
   * 1️⃣ 행 Freeze
   */

  const allRows = [];

  api.forEachNodeAfterFilterAndSort(node => {
    allRows.push(node.data);
  });

  const pinnedRows = allRows.slice(0, rowIndex + 1);
  const normalRows = allRows.slice(rowIndex + 1);

  api.setGridOption("pinnedTopRowData", pinnedRows);
  api.setGridOption("rowData", normalRows);

  /*
   * 2️⃣ 열 Freeze
   */

  const displayedColumns = api.getAllDisplayedColumns();

  const targetIndex = displayedColumns.findIndex(
    col => col.getColId() === targetColId
  );

  const columnState = displayedColumns.map((col, index) => ({
    colId: col.getColId(),
    pinned: index <= targetIndex ? "left" : null
  }));

  api.applyColumnState({
    state: columnState,
    applyOrder: false
  });

};


const unfreezeAllColumns = (params) => {
  const api = params.api;

  const displayedColumns = api.getAllDisplayedColumns();

  const state = displayedColumns.map((col) => ({
    colId: col.getColId(),
    pinned: null,
  }));

  api.applyColumnState({
    state,
    applyOrder: false,
  });
};

const freezeColumnsUntil = (params) => {
  const api = params.api;
  const targetColId = params.column.getColId();

  // 현재 화면에 표시되는 컬럼 순서 기준
  const displayedColumns = api.getAllDisplayedColumns();

  const targetIndex = displayedColumns.findIndex(
    (col) => col.getColId() === targetColId
  );

  if (targetIndex < 0) return;

  const state = displayedColumns.map((col, index) => ({
    colId: col.getColId(),
    pinned: index <= targetIndex ? "left" : null,
  }));

  api.applyColumnState({
    state,
    applyOrder: false,
  });
};

const unfreezeColumns = (params) => {

  const columnApi = params.columnApi;

  const columns = columnApi.getAllGridColumns();

  const reset = columns.map(col => ({
    colId: col.getColId(),
    pinned: null
  }));

  columnApi.applyColumnState({
    state: reset
  });
};




const freezeColumns = (params) => {

  const columnApi = params.columnApi;

  const columns = columnApi.getAllGridColumns();

  const targetIndex = columns.findIndex(
    col => col.getColId() === params.column.getColId()
  );

  const leftColumns = columns.slice(0, targetIndex + 1).map(col => ({
    colId: col.getColId(),
    pinned: "left"
  }));

  columnApi.applyColumnState({
    state: leftColumns,
    applyOrder: false
  });
};




const freezeRows = (params) => {

  const rowIndex = params.node.rowIndex;

  const allRows = [];

  params.api.forEachNodeAfterFilterAndSort(node => {
    allRows.push(node.data);
  });

  const pinnedRows = allRows.slice(0, rowIndex + 1);
  const normalRows = allRows.slice(rowIndex + 1);

  params.api.setGridOption("pinnedTopRowData", pinnedRows);
  params.api.setGridOption("rowData", normalRows);
};


const unfreezeRows = (params) => {

  const pinnedRows = params.api.getPinnedTopRowCount();

  const pinnedData = [];

  for (let i = 0; i < pinnedRows; i++) {
    pinnedData.push(params.api.getPinnedTopRow(i).data);
  }

  const normalRows = [];

  params.api.forEachNode(node => {
    normalRows.push(node.data);
  });

  params.api.setGridOption("pinnedTopRowData", []);
  params.api.setGridOption("rowData", [...pinnedData, ...normalRows]);
};





