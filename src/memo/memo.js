const handleCellContextMenu = (params) => {
  const event = params.event;

  // 🔥 grid body viewport DOM
  const bodyViewport =
    gridRef.current?.eGridDiv?.querySelector('.ag-body-viewport');

  if (!bodyViewport) return;

  const rect = bodyViewport.getBoundingClientRect();

  // 마우스 X를 grid 내부 좌표로 변환
  const relativeX = event.clientX - rect.left;

  // 현재 화면에 표시된 컬럼들
  const columns = params.columnApi.getAllDisplayedColumns();

  let accWidth = 0;
  let clickedCol = null;

  for (const col of columns) {
    accWidth += col.getActualWidth();
    if (relativeX <= accWidth) {
      clickedCol = col;
      break;
    }
  }

  console.log('실제 클릭 컬럼:', clickedCol?.getColId());
};
