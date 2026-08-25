let lastStickyKey = null;
let scrollAnimationFrame = null;

const handleBodyScroll = (event) => {
  if (event.direction !== "vertical") {
    return;
  }

  const api = event.api;

  // 빠르게 스크롤하면 이전 작업은 취소
  if (scrollAnimationFrame) {
    cancelAnimationFrame(scrollAnimationFrame);
  }

  scrollAnimationFrame = requestAnimationFrame(() => {
    const verticalRange =
      api.getVerticalPixelRange();

    const firstVisibleRowIndex =
      api.getRowIndexAtPixel(
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
      stickyRow[field] = getStickyValue(
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
