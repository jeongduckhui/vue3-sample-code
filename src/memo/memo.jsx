const toggleChecked = id => {
  setRows(prev =>
    prev.map(row =>
      row.id === id
        ? { ...row, checked: !row.checked }
        : row
    )
  );
};
