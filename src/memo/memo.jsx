
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


=============================

  
const createStickyRowData = (api, rowNode) => {
  if (!rowNode?.data) {
    return [];
  }

  return [
    {
      ...rowNode.data,

      // Sticky 행 여부
      __isSticky: true,

      // 실제 화면에 표시되던 원본 행 위치
      __sourceRowIndex: rowNode.rowIndex,
    },
  ];
};






const handleBodyScroll = (event) => {
  const { api } = event;

  const firstRowIndex = api.getFirstDisplayedRowIndex();
  const rowNode = api.getDisplayedRowAtIndex(firstRowIndex);

  api.setGridOption(
    "pinnedTopRowData",
    createStickyRowData(api, rowNode)
  );
};




const getSourceCellParams = (params) => {
  if (!params.data?.__isSticky) {
    return params;
  }

  const sourceRowIndex = params.data.__sourceRowIndex;
  const sourceNode =
    params.api.getDisplayedRowAtIndex(sourceRowIndex);

  return {
    ...params,
    node: sourceNode,
    data: sourceNode?.data,
    value: sourceNode?.data?.[params.colDef.field],
  };
};






const cellRenderer = (params) => {
  if (같은값이라서빈칸처리조건(params)) {
    return "";
  }

  if (subtotal조건(params)) {
    return "Subtotal";
  }

  return params.value;
};





const cellRenderer = (params) => {
  const sourceParams = getSourceCellParams(params);

  if (같은값이라서빈칸처리조건(sourceParams)) {
    return "";
  }

  if (subtotal조건(sourceParams)) {
    return "Subtotal";
  }

  return sourceParams.value ?? "";
};





const cellClassRules = {
  "merged-cell": (params) => {
    const sourceParams = getSourceCellParams(params);

    return 같은값이라서병합처리조건(sourceParams);
  },

  "subtotal-cell": (params) => {
    const sourceParams = getSourceCellParams(params);

    return subtotal조건(sourceParams);
  },
};




const cellClassRules = {
  "merged-cell": (params) => {
    const sourceParams = getSourceCellParams(params);

    return 같은값이라서병합처리조건(sourceParams);
  },

  "subtotal-cell": (params) => {
    const sourceParams = getSourceCellParams(params);

    return subtotal조건(sourceParams);
  },
};





const shouldHideCellValue = (params) => {
  // 기존 동일 값 빈칸 처리 로직
};

const isSubtotalCell = (params) => {
  // 기존 Subtotal 판단 로직
};





const cellRenderer = (params) => {
  const sourceParams = getSourceCellParams(params);

  if (shouldHideCellValue(sourceParams)) {
    return "";
  }

  if (isSubtotalCell(sourceParams)) {
    return "Subtotal";
  }

  return sourceParams.value ?? "";
};





const cellClassRules = {
  "merged-cell": (params) =>
    shouldHideCellValue(getSourceCellParams(params)),

  "subtotal-cell": (params) =>
    isSubtotalCell(getSourceCellParams(params)),
};




=============================

  const handleBodyScroll = (event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const { api, top } = event;

  const firstVisibleRowIndex =
    api.getRowIndexAtPixel(top + 1);

  if (firstVisibleRowIndex == null) {
    api.setGridOption("pinnedTopRowData", []);
    return;
  }

  const rowNode =
    api.getDisplayedRowAtIndex(firstVisibleRowIndex);

  const stickyRowData =
    createStickyRowData(api, rowNode);

  api.setGridOption(
    "pinnedTopRowData",
    stickyRowData
  );
};
  
const scrollFrameRef = useRef(null);

const handleBodyScroll = useCallback((event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const { api, top } = event;

  if (scrollFrameRef.current) {
    cancelAnimationFrame(scrollFrameRef.current);
  }

  scrollFrameRef.current = requestAnimationFrame(() => {
    const firstVisibleRowIndex =
      api.getRowIndexAtPixel(top + 1);

    if (firstVisibleRowIndex == null) {
      api.setGridOption("pinnedTopRowData", []);
      return;
    }

    const rowNode =
      api.getDisplayedRowAtIndex(firstVisibleRowIndex);

    api.setGridOption(
      "pinnedTopRowData",
      createStickyRowData(api, rowNode)
    );
  });
}, []);



const stickyRowIndexRef = useRef(null);
const scrollFrameRef = useRef(null);

const handleBodyScroll = useCallback((event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const { api, top } = event;

  if (scrollFrameRef.current) {
    cancelAnimationFrame(scrollFrameRef.current);
  }

  scrollFrameRef.current = requestAnimationFrame(() => {
    const visibleRowIndex =
      api.getRowIndexAtPixel(top + 1);

    if (visibleRowIndex == null) {
      stickyRowIndexRef.current = null;
      api.setGridOption("pinnedTopRowData", []);
      return;
    }

    if (
      stickyRowIndexRef.current === visibleRowIndex
    ) {
      return;
    }

    const rowNode =
      api.getDisplayedRowAtIndex(visibleRowIndex);

    if (!rowNode) {
      return;
    }

    stickyRowIndexRef.current = visibleRowIndex;

    api.setGridOption(
      "pinnedTopRowData",
      createStickyRowData(api, rowNode)
    );
  });
}, []);


===========

const getVisibleRowIndex = (api, scrollTop) => {
  const rowCount = api.getDisplayedRowCount();

  for (let index = 0; index < rowCount; index += 1) {
    const rowNode =
      api.getDisplayedRowAtIndex(index);

    if (!rowNode) {
      continue;
    }

    const rowTop = rowNode.rowTop ?? 0;
    const rowHeight = rowNode.rowHeight ?? 0;
    const rowBottom = rowTop + rowHeight;

    if (rowBottom > scrollTop) {
      return index;
    }
  }

  return null;
};




const handleBodyScroll = (event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const { api, top } = event;

  const visibleRowIndex =
    getVisibleRowIndex(api, top + 1);

  if (visibleRowIndex == null) {
    api.setGridOption("pinnedTopRowData", []);
    return;
  }

  const rowNode =
    api.getDisplayedRowAtIndex(visibleRowIndex);

  if (!rowNode) {
    return;
  }

  api.setGridOption(
    "pinnedTopRowData",
    createStickyRowData(api, rowNode)
  );
};





const getVisibleRowIndex = (api, scrollTop) => {
  let left = 0;
  let right = api.getDisplayedRowCount() - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const rowNode =
      api.getDisplayedRowAtIndex(middle);

    if (!rowNode) {
      return null;
    }

    const rowTop = rowNode.rowTop ?? 0;
    const rowHeight = rowNode.rowHeight ?? 0;
    const rowBottom = rowTop + rowHeight;

    if (scrollTop < rowTop) {
      right = middle - 1;
    } else if (scrollTop >= rowBottom) {
      left = middle + 1;
    } else {
      return middle;
    }
  }

  return left < api.getDisplayedRowCount()
    ? left
    : null;
};






const scrollFrameRef = useRef(null);
const stickyRowIndexRef = useRef(null);

const handleBodyScroll = useCallback((event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const { api, top } = event;

  if (scrollFrameRef.current) {
    cancelAnimationFrame(scrollFrameRef.current);
  }

  scrollFrameRef.current = requestAnimationFrame(() => {
    const visibleRowIndex =
      getVisibleRowIndex(api, top + 1);

    if (visibleRowIndex == null) {
      stickyRowIndexRef.current = null;
      api.setGridOption("pinnedTopRowData", []);
      return;
    }

    if (
      stickyRowIndexRef.current === visibleRowIndex
    ) {
      return;
    }

    const rowNode =
      api.getDisplayedRowAtIndex(visibleRowIndex);

    if (!rowNode) {
      return;
    }

    stickyRowIndexRef.current = visibleRowIndex;

    api.setGridOption(
      "pinnedTopRowData",
      createStickyRowData(api, rowNode)
    );
  });
}, []);






===================
  
  const handleBodyScroll = useCallback((event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const { api, top } = event;

  if (scrollFrameRef.current) {
    cancelAnimationFrame(scrollFrameRef.current);
  }

  scrollFrameRef.current = requestAnimationFrame(() => {
    scrollFrameRef.current = null;

    const rowCount = api.getDisplayedRowCount();

    if (rowCount === 0) {
      clearStickyRow(api);
      return;
    }

    const firstRowNode =
      api.getDisplayedRowAtIndex(0);

    const firstRowBottom =
      (firstRowNode?.rowTop ?? 0) +
      (firstRowNode?.rowHeight ?? 0);

    if (top < firstRowBottom) {
      clearStickyRow(api);
      return;
    }

    const visibleRowIndex =
      getVisibleRowIndex(api, top + 1);

    if (visibleRowIndex == null) {
      clearStickyRow(api);
      return;
    }

    const targetRowIndex = Math.max(
      0,
      Math.min(
        visibleRowIndex - 1,
        rowCount - 1
      )
    );

    if (targetRowIndex === 0) {
      clearStickyRow(api);
      return;
    }

    if (
      stickyRowIndexRef.current === targetRowIndex
    ) {
      return;
    }

    const rowNode =
      api.getDisplayedRowAtIndex(targetRowIndex);

    if (!rowNode) {
      clearStickyRow(api);
      return;
    }

    stickyRowIndexRef.current =
      targetRowIndex;

    api.setGridOption(
      "pinnedTopRowData",
      createStickyRowData(api, rowNode)
    );
  });
}, []);






import {
  useCallback,
  useEffect,
  useRef,
} from "react";

const useGridStickyRow = ({
  gridApi,
}) => {
  const scrollFrameRef = useRef(null);
  const stickyRowIndexRef = useRef(null);

  const clearStickyRow = useCallback((api) => {
    stickyRowIndexRef.current = null;

    api.setGridOption(
      "pinnedTopRowData",
      []
    );
  }, []);

  const handleBodyScroll = useCallback(
    (event) => {
      // Sticky 처리
    },
    [clearStickyRow]
  );

  useEffect(() => {
    if (!gridApi) {
      return;
    }

    gridApi.addEventListener(
      "bodyScroll",
      handleBodyScroll
    );

    return () => {
      gridApi.removeEventListener(
        "bodyScroll",
        handleBodyScroll
      );

      if (scrollFrameRef.current) {
        cancelAnimationFrame(
          scrollFrameRef.current
        );

        scrollFrameRef.current = null;
      }

      clearStickyRow(gridApi);
    };
  }, [
    gridApi,
    handleBodyScroll,
    clearStickyRow,
  ]);
};

export default useGridStickyRow;
