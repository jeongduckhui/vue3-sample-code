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
