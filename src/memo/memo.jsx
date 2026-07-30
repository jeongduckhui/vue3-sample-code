function addLeftBorderToFirstPath(column) {
  // 부모 그룹 컬럼
  if (column.children?.length) {
    const [firstChild, ...otherChildren] = column.children;

    return {
      ...column,
      headerGroupClass: [
        column.headerGroupClass,
        "dynamic-first-left-border",
      ]
        .filter(Boolean)
        .join(" "),

      children: [
        addLeftBorderToFirstPath(firstChild),
        ...otherChildren,
      ],
    };
  }

  // 마지막 leaf 컬럼
  return {
    ...column,
    headerClass: [
      column.headerClass,
      "dynamic-first-left-border",
    ]
      .filter(Boolean)
      .join(" "),
  };
}
