onCellContextMenu={(params) => {
  const mouseX = params.event.clientX;

  const gridBodyRect =
    params.api.gridBodyCtrl.eBodyViewport.getBoundingClientRect();

  const relativeX = mouseX - gridBodyRect.left;

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

  console.log('실제 클릭 컬럼:', clickedColumn?.getColId());
}}
