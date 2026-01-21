const handleCellContextMenu = (params) => {
  // ✅ 행 정보
  const rowIndex = params.node.rowIndex;      // 0-based
  const rowNumber = rowIndex + 1;              // 사용자 표시용
  const rowData = params.node.data;             // 실제 데이터
  const isPinned = params.node.rowPinned;       // pinned 여부

  // ✅ 컬럼 정보 (이전 답변 로직)
  const event = params.event;
  const gridRoot = event.currentTarget.closest('.ag-root');
  const bodyViewport = gridRoot.querySelector('.ag-body-viewport');
  const rect = bodyViewport.getBoundingClientRect();
  const relativeX = event.clientX - rect.left;

  const columns = params.api.getAllDisplayedColumns();
  let acc = 0;
  let clickedCol = null;

  for (const col of columns) {
    acc += col.getActualWidth();
    if (relativeX <= acc) {
      clickedCol = col;
      break;
    }
  }

  console.log({
    rowIndex,        // 내부 index
    rowNumber,       // 화면 번호
    rowData,         // 데이터
    pinned: isPinned,
    colId: clickedCol?.getColId(),
  });
};
