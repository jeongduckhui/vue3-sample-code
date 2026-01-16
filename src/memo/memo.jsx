useUiRenderTime.js

import { useEffect, useRef, useState } from 'react';

export function useUiRenderTime(deps = []) {
  const fetchEndRef = useRef(null);
  const [uiTimeMs, setUiTimeMs] = useState(null);

  // 조회 완료 시점 기록
  const markFetchEnd = () => {
    fetchEndRef.current = performance.now();
  };

  // 화면 구성 완료 시점
  useEffect(() => {
    if (!fetchEndRef.current) return;

    const elapsed = performance.now() - fetchEndRef.current;
    setUiTimeMs(elapsed);
  }, deps);

  return {
    uiTimeMs,
    markFetchEnd,
  };
}

ParentScreen.jsx
const ParentScreen = () => {
  const [traceInfo, setTraceInfo] = useState(null);
  const [rowData, setRowData] = useState([]);

  const { uiTimeMs, markFetchEnd } = useUiRenderTime([rowData]);

  const loadData = async () => {
    const res = await axios.get('/api/data');

    // 🔥 조회 완료 시점만 알려주면 됨
    markFetchEnd();

    setRowData(res.data.rows);

    setTraceInfo({
      ...res.data.trace,
      uiTimeMs: 0,
    });
  };

  // uiTimeMs가 계산되면 traceInfo 갱신
  useEffect(() => {
    if (!traceInfo || uiTimeMs == null) return;

    setTraceInfo(prev => ({
      ...prev,
      uiTimeMs,
      totalTimeMs: prev.serverTimeMs + uiTimeMs,
    }));
  }, [uiTimeMs]);

  return (
    <>
      <button onClick={loadData}>조회</button>

      {traceInfo && (
        <TracePopup traceInfo={traceInfo} />
      )}
    </>
  );
};



