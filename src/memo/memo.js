const findRealRowByMouse = (params) => {
  const e = params.event;

  const gridRoot = e.currentTarget.closest('.ag-root');
  if (!gridRoot) return null;

  const bodyViewport = gridRoot.querySelector('.ag-body-viewport');
  if (!bodyViewport) return null;

  const rect = bodyViewport.getBoundingClientRect();

  // 1) viewport 안에서의 Y
  const relativeY = e.clientY - rect.top;

  // 2) 스크롤 보정 (🔥 이게 핵심)
  const yInAllRows = relativeY + bodyViewport.scrollTop;

  // 3) 현재 렌더된 노드들에서 rowTop/rowHeight로 실제 행 찾기
  //    (가상 스크롤이므로 전체 노드 순회 X, 렌더된 것만)
  const rendered = params.api.getRenderedNodes?.() ?? [];
  for (const node of rendered) {
    // rowTop은 "전체 rows 기준" pixel top
    const top = node.rowTop ?? 0;
    const h = node.rowHeight ?? 0;

    if (yInAllRows >= top && yInAllRows < top + h) {
      return node; // ✅ 이 node가 클릭된 실제 행
    }
  }

  // fallback: 못 찾으면 params.node(병합 시작행)라도 반환
  return params.node ?? null;
};
