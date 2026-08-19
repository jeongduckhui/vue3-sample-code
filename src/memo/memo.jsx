// 조회 조건 등에 따라 2~10개로 달라지는 정적 컬럼
const staticColumnDefs: ColDef[] = createStaticColumnDefs(searchCondition);

// 정적 컬럼 ID 동적 생성
const staticColumnIds = new Set(
  staticColumnDefs.map(col => col.colId ?? String(col.field))
);

const isTotalRow = (data: any) =>
  data?.rowType === 'G_TOTAL';
// 또는 data?.[첫번째정적컬럼필드] === 'G-totaln'

const getStaticColumnSpan = (params: ColSpanParams): number => {
  if (!isTotalRow(params.data)) {
    return 1;
  }

  const displayedColumns = params.api.getAllDisplayedColumns();
  const currentIndex = displayedColumns.findIndex(
    column => column === params.column
  );

  let spanCount = 0;

  for (let i = currentIndex; i < displayedColumns.length; i++) {
    const columnId = displayedColumns[i].getColId();

    // 동적 컬럼을 만나는 순간 종료
    if (!staticColumnIds.has(columnId)) {
      break;
    }

    spanCount++;
  }

  return Math.max(spanCount, 1);
};
