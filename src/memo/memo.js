

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





