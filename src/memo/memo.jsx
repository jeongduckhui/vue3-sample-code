const applyOrderIndex = (fixedColumnDefs, strDim) => {
  const fieldOrderMap = new Map(
    strDim
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean)
      .map((field, index) => [field, index])
  );

  return fixedColumnDefs.map((column) => ({
    ...column,
    ...(fieldOrderMap.has(column.field) && {
      orderIndex: fieldOrderMap.get(column.field),
    }),
  }));
};
