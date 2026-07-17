function createFixedColumnDefs(rowData) {
  /*
   * 조회 결과가 없으면 고정 컬럼도 생성하지 않는다.
   */
  if (!rowData?.length) {
    return [];
  }

  const firstRow = rowData[0];

  /*
   * FIXED_FIELDS에 등록되어 있으면서
   * 첫 번째 조회 행에 실제로 존재하는 필드만 추출한다.
   *
   * 값이 null이어도 필드 자체가 존재하면 컬럼은 생성해야 하므로
   * firstRow[field] !== undefined 방식이 아니라
   * hasOwnProperty를 사용한다.
   */
  const existingFixedFields = FIXED_FIELDS.filter((field) =>
    Object.prototype.hasOwnProperty.call(firstRow, field),
  );

  /*
   * FIXED_COLUMN_DEFS의 순서를 기준으로 실제 컬럼을 생성한다.
   *
   * FIXED_FIELDS의 순서가 아니라 FIXED_COLUMN_DEFS의 순서대로
   * 화면에 표시된다.
   */
  const fixedLeafColumns = FIXED_COLUMN_DEFS
    .filter((columnDef) =>
      existingFixedFields.includes(columnDef.field),
    )
    .map((columnDef) => ({
      ...columnDef,
      colId: columnDef.colId ?? columnDef.field,
    }));

  /*
   * 실제로 조회된 고정 컬럼이 하나도 없으면
   * 빈 부모 그룹도 만들지 않는다.
   */
  if (fixedLeafColumns.length === 0) {
    return [];
  }

  /*
   * 전체 헤더 높이는 4depth다.
   *
   * 1depth: 빈 부모
   * 2depth: 제품 정보
   * 3depth: 빈 부모
   * 4depth: 실제 고정 컬럼
   */
  return [
    {
      headerName: "",
      groupId: "FIXED_ROOT",
      marryChildren: true,
      children: [
        {
          headerName: "제품 정보",
          groupId: "FIXED_PRODUCT_INFO",
          marryChildren: true,
          children: [
            {
              headerName: "",
              groupId: "FIXED_PRODUCT_INFO_DETAIL",
              marryChildren: true,
              children: fixedLeafColumns,
            },
          ],
        },
      ],
    },
  ];
}
