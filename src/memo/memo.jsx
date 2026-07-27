const normalizeGrandTotalRow = (rowData, orderedColumnDefs) => {
  if (!rowData?.length || !orderedColumnDefs?.length) {
    return rowData;
  }

  const firstRow = rowData[0];

  // G-Total이 들어 있는 필드 찾기
  const grandTotalField = Object.keys(firstRow).find(
    (field) => firstRow[field] === "G-Total"
  );

  if (!grandTotalField) {
    return rowData;
  }

  // 현재 그리드에서 첫 번째로 보이는 컬럼
  const firstColumnField = orderedColumnDefs.find(
    (column) => column.field && !column.hide
  )?.field;

  if (!firstColumnField) {
    return rowData;
  }

  const normalizedFirstRow = {
    ...firstRow,

    // 기존 G-Total 위치 제거
    [grandTotalField]: "",

    // 첫 번째 컬럼으로 이동
    [firstColumnField]: "G-Total",
  };

  return [normalizedFirstRow, ...rowData.slice(1)];
};
