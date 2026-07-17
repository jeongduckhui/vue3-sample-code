function createFixedColumnDefs() {
  /*
   * FIXED_COLUMN_DEFS 중에서
   * FIXED_FIELDS에 등록된 필드만 고정 컬럼으로 사용한다.
   */
  const fixedLeafColumns = FIXED_COLUMN_DEFS
    .filter((columnDef) =>
      FIXED_FIELDS.includes(columnDef.field),
    )
    .map((columnDef) => ({
      ...columnDef,

      /*
       * field가 있는데 colId가 없는 경우를 대비한다.
       */
      colId: columnDef.colId ?? columnDef.field,
    }));

  if (fixedLeafColumns.length === 0) {
    return [];
  }

  /*
   * 동적 컬럼과 동일하게 총 4depth를 맞춘다.
   *
   * 1depth: 빈 그룹
   * 2depth: 제품 정보
   * 3depth: 빈 그룹
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
