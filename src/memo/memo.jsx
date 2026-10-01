
const getDisplayValue = (params) => {
  const { api, node, colDef, value } = params;

  if (!node || node.rowPinned) {
    return value ?? "";
  }

  const rowIndex = node.rowIndex;
  const field = colDef.field;

  if (rowIndex > 0) {
    const previousNode = api.getDisplayedRowAtIndex(rowIndex - 1);
    const previousValue = previousNode?.data?.[field];

    if (previousValue === value) {
      return "";
    }
  }

  return value ?? "";
};





const createStickyRowData = (api, rowNode) => {
  if (!rowNode) {
    return [];
  }

  const stickyRow = {
    __sticky: true,
    __sourceRowIndex: rowNode.rowIndex,
  };

  api.getAllDisplayedColumns().forEach((column) => {
    const colDef = column.getColDef();
    const field = colDef.field;

    if (!field) {
      return;
    }

    const rawValue = api.getValue(column, rowNode);

    stickyRow[field] = getDisplayValue({
      api,
      node: rowNode,
      colDef,
      column,
      value: rawValue,
      data: rowNode.data,
    });
  });

  return [stickyRow];
};












const handleBodyScroll = (event) => {
  const { api } = event;

  const firstVisibleRowIndex = api.getFirstDisplayedRowIndex();
  const rowNode = api.getDisplayedRowAtIndex(firstVisibleRowIndex);

  const stickyRowData = createStickyRowData(api, rowNode);

  api.setGridOption("pinnedTopRowData", stickyRowData);
};




const getDisplayValue = (params) => {
  if (params.data?.__sticky) {
    return params.value ?? "";
  }

  // Subtotal 처리
  if (isSubtotalRow(params)) {
    return getSubtotalDisplayValue(params);
  }

  // 동일 값 병합 표현
  if (shouldHideDuplicatedValue(params)) {
    return "";
  }

  return params.value ?? "";
};





const getGridDisplayValue = (params) => {
  if (isSubtotalRow(params)) {
    return getSubtotalDisplayValue(params);
  }

  if (shouldHideDuplicatedValue(params)) {
    return "";
  }

  return params.value ?? "";
};







const valueFormatter = (params) => {
  if (params.data?.__sticky) {
    return params.value ?? "";
  }

  return getGridDisplayValue(params);
};




const createStickyRowData = (api, rowNode) => {
  const stickyRow = {
    __sticky: true,
  };

  api.getAllDisplayedColumns().forEach((column) => {
    const colDef = column.getColDef();

    if (!colDef.field) {
      return;
    }

    stickyRow[colDef.field] = getGridDisplayValue({
      api,
      node: rowNode,
      data: rowNode.data,
      value: api.getValue(column, rowNode),
      column,
      colDef,
    });
  });

  return [stickyRow];
};






