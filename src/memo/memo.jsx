const ParentScreen = () => {
  const [traceInfo, setTraceInfo] = useState(null);
  const fetchEndRef = useRef(null);

  const loadData = async () => {
    const res = await axios.get('/api/data');

    // 조회 완료 시점
    fetchEndRef.current = performance.now();

    setRowData(res.data.rows);

    // 서버에서 내려온 trace 정보 일부
    setTraceInfo({
      ...res.data.trace,
      uiTimeMs: 0, // 일단 0으로
    });
  };

  // 🔥 화면 구성 완료 시점
  useEffect(() => {
    if (!traceInfo || !fetchEndRef.current) return;

    const uiTimeMs = performance.now() - fetchEndRef.current;

    setTraceInfo(prev => ({
      ...prev,
      uiTimeMs,
      totalTimeMs: prev.serverTimeMs + uiTimeMs,
    }));
  }, [rowData]);

  return (
    <>
      <button onClick={loadData}>조회</button>

      {traceInfo && (
        <TracePopup traceInfo={traceInfo} />
      )}
    </>
  );
};
