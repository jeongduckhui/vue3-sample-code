import React, { useState } from 'react';
import axios from 'axios';
import TraceBoundary from './TraceBoundary';
import QueryPopup from './QueryPopup';

const ParentScreen = () => {
  const [rows, setRows] = useState([]);
  const [traceBase, setTraceBase] = useState(null);

  const loadData = async () => {
    const searchParam = {
      customerId: 'C001',
    };

    const fetchStart = performance.now();

    const res = await axios.get('/api/data', {
      params: searchParam,
    });

    const fetchEnd = performance.now();

    setRows(res.data.rows);

    setTraceBase({
      networkTimeMs: fetchEnd - fetchStart,
      serverTxTimeMs:
        res.data?.trace?.transactionTimeMs ?? 0,
    });
  };

  return (
    <>
      <button onClick={loadData}>조회</button>

      {traceBase && (
        <TraceBoundary traceBase={traceBase}>
          <QueryPopup rows={rows} />
        </TraceBoundary>
      )}
    </>
  );
};

export default ParentScreen;



import React, { useEffect, useRef, useState } from 'react';

const TraceBoundary = ({
  traceBase,   // { networkTimeMs, serverTxTimeMs }
  children,
}) => {
  const [traceInfo, setTraceInfo] = useState(null);
  const renderStartRef = useRef(null);

  // 1️⃣ 렌더 시작 시점
  useEffect(() => {
    renderStartRef.current = performance.now();
  }, []);

  // 2️⃣ children 렌더 완료 후 UI 시간 계산
  useEffect(() => {
    if (!traceBase) return;
    if (!renderStartRef.current) return;

    const uiTimeMs =
      performance.now() - renderStartRef.current;

    const totalTimeMs =
      traceBase.networkTimeMs +
      traceBase.serverTxTimeMs +
      uiTimeMs;

    setTraceInfo({
      ...traceBase,
      uiTimeMs,
      totalTimeMs,
    });
  }, [traceBase]);

  return (
    <>
      {traceInfo && (
        <div style={{ marginBottom: 12 }}>
          <div>네트워크(ms): {traceInfo.networkTimeMs.toFixed(1)}</div>
          <div>서버Tx(ms): {traceInfo.serverTxTimeMs}</div>
          <div>UI(ms): {traceInfo.uiTimeMs.toFixed(1)}</div>
          <div>
            <b>총소요(ms): {traceInfo.totalTimeMs.toFixed(1)}</b>
          </div>
        </div>
      )}

      {children}
    </>
  );
};

export default TraceBoundary;



// src/hooks/useTraceQuery.js
import { useEffect, useRef, useState } from 'react';

export function useTraceQuery({ uiDeps = [] } = {}) {
  const [data, setData] = useState(null);
  const [traceInfo, setTraceInfo] = useState(null);

  // 시간 기준점
  const fetchStartRef = useRef(null);
  const fetchEndRef = useRef(null);

  // 1️⃣ 조회 실행 (axios 포함)
  const execute = async fetchFn => {
    fetchStartRef.current = performance.now();

    const res = await fetchFn();

    fetchEndRef.current = performance.now();

    const networkTimeMs =
      fetchEndRef.current - fetchStartRef.current;

    const serverTxTimeMs =
      res.data?.trace?.transactionTimeMs ?? 0;

    // UI 시간은 아직 모름
    setTraceInfo({
      networkTimeMs,
      serverTxTimeMs,
      uiTimeMs: null,
      totalTimeMs: null,
    });

    setData(res.data);

    return res; // 호출부에서도 필요하면 사용
  };

  // 2️⃣ UI 렌더 완료 시점 감지
  useEffect(() => {
    if (!fetchEndRef.current) return;
    if (!traceInfo || traceInfo.uiTimeMs != null) return;

    const uiTimeMs =
      performance.now() - fetchEndRef.current;

    setTraceInfo(prev => {
      if (!prev) return prev;

      const totalTimeMs =
        prev.networkTimeMs +
        prev.serverTxTimeMs +
        uiTimeMs;

      return {
        ...prev,
        uiTimeMs,
        totalTimeMs,
      };
    });
  }, uiDeps);

  return {
    data,
    traceInfo,
    execute,
  };
}



const ParentScreen = () => {
  const [rowData, setRowData] = useState([]);

  const { data, traceInfo, execute } = useTraceQuery({
    uiDeps: [rowData.length],
  });

  const loadData = async () => {
    const searchParam = {
      customerId: 'C001',
      fromDate: '2026-01-01',
      toDate: '2026-01-31',
    };

    const res = await execute(() =>
      axios.get('/api/data', { params: searchParam })
    );

    setRowData(res.data.rows);
  };

  return (
    <>
      <button onClick={loadData}>조회</button>
      {traceInfo && <TracePopup traceInfo={traceInfo} />}
    </>
  );
};

