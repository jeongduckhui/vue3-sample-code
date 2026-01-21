const handleCellContextMenu = (params) => {
  const event = params.event;

  // 🔥 grid root DOM (가장 안전)
  const gridRoot = event.currentTarget.closest('.ag-root');
  if (!gridRoot) return;

  // 🔥 body viewport
  const bodyViewport = gridRoot.querySelector('.ag-body-viewport');
  if (!bodyViewport) return;

  const rect = bodyViewport.getBoundingClientRect();

  // 마우스 X를 grid 내부 기준 좌표로 변환
  const relativeX = event.clientX - rect.left;

  // 현재 화면에 보이는 컬럼들
  const columns = params.columnApi.getAllDisplayedColumns();

  let accWidth = 0;
  let clickedColumn = null;

  for (const col of columns) {
    accWidth += col.getActualWidth();
    if (relativeX <= accWidth) {
      clickedColumn = col;
      break;
    }
  }

  console.log('🔥 실제 클릭 컬럼:', clickedColumn?.getColId());
};
