const getFirstVisibleRowIndex = (
  api,
  scrollTop
) => {
  const renderedNodes =
    api.getRenderedNodes();

  const firstVisibleNode = renderedNodes
    .filter((node) => {
      if (
        node.rowTop === null ||
        node.rowTop === undefined
      ) {
        return false;
      }

      const rowBottom =
        node.rowTop + node.rowHeight;

      return rowBottom > scrollTop;
    })
    .sort((a, b) => {
      return a.rowTop - b.rowTop;
    })[0];

  return firstVisibleNode?.rowIndex;
};









let lastStickyKey = null;
let scrollAnimationFrame = null;

const handleBodyScroll = (event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const api = event.api;

  if (scrollAnimationFrame) {
    cancelAnimationFrame(
      scrollAnimationFrame
    );
  }

  scrollAnimationFrame =
    requestAnimationFrame(() => {
      const verticalRange =
        api.getVerticalPixelRange();

      const firstVisibleRowIndex =
        getFirstVisibleRowIndex(
          api,
          verticalRange.top
        );

      if (
        firstVisibleRowIndex === null ||
        firstVisibleRowIndex === undefined ||
        firstVisibleRowIndex <= 0
      ) {
        lastStickyKey = null;

        api.setGridOption(
          "pinnedTopRowData",
          []
        );

        return;
      }

      const stickyRow = {};

      fixedFields.forEach((field) => {
        stickyRow[field] =
          getStickyValue(
            api,
            firstVisibleRowIndex,
            field
          );
      });

      const stickyKey = fixedFields
        .map((field) => stickyRow[field])
        .join("|");

      if (stickyKey === lastStickyKey) {
        return;
      }

      lastStickyKey = stickyKey;

      api.setGridOption(
        "pinnedTopRowData",
        [stickyRow]
      );
    });
};
