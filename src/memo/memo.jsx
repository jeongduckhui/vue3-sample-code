const gridRef = useRef(null);
const [gridHeight, setGridHeight] = useState(0);

const detailSearchOpen = ...;
const gridOnlyOpen = ...;

useLayoutEffect(() => {
  const updateGridHeight = () => {
    if (!gridRef.current) return;

    const { top } = gridRef.current.getBoundingClientRect();
    const bottomMargin = 20;

    setGridHeight(window.innerHeight - top - bottomMargin);
  };

  // 상세검색 DOM이 실제로 열린 다음 측정
  const frameId = requestAnimationFrame(updateGridHeight);

  window.addEventListener("resize", updateGridHeight);

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", updateGridHeight);
  };
}, [detailSearchOpen, gridOnlyOpen]);
