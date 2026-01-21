const handleCellContextMenu = (params) => {
  const event = params.event;

  // 🔥 grid root
  const gridRoot = event.currentTarget.closest('.ag-root');
  if (!gridRoot) return;

  // 🔥 body viewport
  const bodyViewport = gridRoot.querySelector('.ag-body-viewport');
  if (!bodyViewport) return;

  const rect = bodyViewport.getBoundingClientRect();

  // 🔥 마우스 Y를 grid 내부 좌표로 변환
  const relativeY = event.clientY - rect.top;

  // 🔥 현재 화면에 렌더된 row nodes
  const rowNodes = [];
  params.api.forEachNodeAfterFilterAndSort(node => {
    if (!node.rowPinned) {
      rowNodes.push(node);
    }
  });

  let accHeight = 0;
  let clickedRowNode = null;

  for (const node of rowNodes) {
    accHeight += node.rowHeight;
    if (relativeY <= accHeight) {
      clickedRowNode = node;
      break;
    }
  }

  const realRowIndex = clickedRowNode?.rowIndex;

  console.log('🔥 실제 클릭 행 index:', realRowIndex);
};
