const gridWrapperRef = useRef(null);
const [gridHeight, setGridHeight] = useState(300);

useLayoutEffect(() => {
  const updateGridHeight = () => {
    if (!gridWrapperRef.current) return;

    const top = gridWrapperRef.current.getBoundingClientRect().top;
    const calculatedHeight = window.innerHeight - top - 20;

    setGridHeight(Math.max(calculatedHeight, 200));
  };

  // 최초 렌더링 후 실제 DOM 위치가 잡힌 다음 계산
  const frameId = requestAnimationFrame(() => {
    updateGridHeight();
  });

  window.addEventListener("resize", updateGridHeight);

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", updateGridHeight);
  };
}, [detailSearchOpen, gridOnlyOpen]);






<div
  ref={gridWrapperRef}
  className="ag-theme-balham"
  style={{
    width: "100%",
    height: `${gridHeight}px`,
    minHeight: "200px",
  }}
>
  <AgGridReact
    rowData={rowData}
    columnDefs={columnDefs}
    onGridReady={(params) => {
      params.api.doLayout();
    }}
  />
</div>







useLayoutEffect(() => {
  const updateGridHeight = () => {
    if (!gridWrapperRef.current) return;

    const top = gridWrapperRef.current.getBoundingClientRect().top;
    const calculatedHeight = window.innerHeight - top - 20;

    setGridHeight(Math.max(calculatedHeight, 200));
  };

  const observer = new ResizeObserver(updateGridHeight);

  // 그리드 자신보다 레이아웃이 변하는 부모를 감시
  const parentElement = gridWrapperRef.current?.parentElement;

  if (parentElement) {
    observer.observe(parentElement);
  }

  updateGridHeight();
  window.addEventListener("resize", updateGridHeight);

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", updateGridHeight);
  };
}, []);
