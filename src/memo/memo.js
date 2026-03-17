
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





