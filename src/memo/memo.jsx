const gridWrapperRef = useRef(null);
const gridApiRef = useRef(null);

const [gridHeight, setGridHeight] = useState(null);

useLayoutEffect(() => {
  const gridElement = gridWrapperRef.current;
  if (!gridElement) return;

  const updateGridHeight = () => {
    const { top } = gridElement.getBoundingClientRect();
    const nextHeight = Math.max(window.innerHeight - top - 20, 200);

    setGridHeight(nextHeight);
  };

  // 최초 로딩 즉시 계산
  updateGridHeight();

  const parentElement = gridElement.parentElement;
  const resizeObserver = new ResizeObserver(() => {
    updateGridHeight();
  });

  if (parentElement) {
    resizeObserver.observe(parentElement);
  }

  window.addEventListener("resize", updateGridHeight);

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener("resize", updateGridHeight);
  };
}, []);




useLayoutEffect(() => {
  const gridElement = gridWrapperRef.current;
  if (!gridElement) return;

  const frameId = requestAnimationFrame(() => {
    const { top } = gridElement.getBoundingClientRect();
    const nextHeight = Math.max(window.innerHeight - top - 20, 200);

    setGridHeight(nextHeight);
  });

  return () => cancelAnimationFrame(frameId);
}, [detailSearchOpen, gridOnlyOpen]);





useEffect(() => {
  if (gridHeight == null) return;

  const frameId = requestAnimationFrame(() => {
    gridApiRef.current?.doLayout();
  });

  return () => cancelAnimationFrame(frameId);
}, [gridHeight]);




<div
  ref={gridWrapperRef}
  className="ag-theme-balham"
  style={{
    width: "100%",
    height: gridHeight == null ? "200px" : `${gridHeight}px`,
  }}
>
  <AgGridReact
    rowData={rowData}
    columnDefs={columnDefs}
    onGridReady={(params) => {
      gridApiRef.current = params.api;

      // API가 준비된 직후에도 현재 높이로 한 번 배치
      requestAnimationFrame(() => {
        params.api.doLayout();
      });
    }}
  />
</div>
