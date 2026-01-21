const handleCellContextMenu = (params) => {
  const event = params.event;

  // 1️⃣ grid root
  const gridRoot = event.currentTarget.closest('.ag-root');
  if (!gridRoot) return;

  // 2️⃣ body viewport
  const bodyViewport = gridRoot.querySelector('.ag-body-viewport');
  if (!bodyViewport) return;

  const rect = bodyViewport.getBoundingClientRect();

  // 3️⃣ grid 내부 X 좌표
  const relativeX = event.clientX - rect.left;

  // 🔥 4️⃣ 표시 중인 컬럼들 (v29+ 정답)
  const columns = params.api.getAllDisplayedColumns();

  let accWidth = 0;
  let clickedColumn = null;

  for (const col of columns) {
    accWidth += col.getActualWidth();
    if (relativeX <= accWidth) {
      clickedColumn = col;
      break;
    }
  }

  console.log('✅ 실제 클릭 컬럼:', clickedColumn?.getColId());
};
