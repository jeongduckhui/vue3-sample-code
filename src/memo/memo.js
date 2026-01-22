import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import CustomHeader from './CustomHeader';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

/** 서버 메타를 가져오는 기존 함수 */
function getServerMeta() {
  return {
    baseColumns: ['A', 'B', 'D'],
    expandColumns: [
      { groupKey: 'M1', children: 'W1' },
      { groupKey: 'M1', children: 'W2' },
      { groupKey: 'M1', children: 'W3' },
      { groupKey: 'M2', children: 'W4' },
      { groupKey: 'M2', children: 'W5' },
      { groupKey: 'M2', children: 'W6' },
      { groupKey: 'M2', children: 'W7' },
      { groupKey: 'M3', children: 'W8' },
    ],
  };
}

/** 더미 데이터 */
const rowData = Array.from({ length: 5 }).map((_, i) => ({
  A: `A${i + 1}`,
  B: `B${i + 1}`,
  C: `C${i + 1}`,
  D: `D${i + 1}`,
  W1: 10, W2: 20, W3: 30,
  W4: 40, W5: 50, W6: 60, W7: 70,
  W8: 80,
}));

export default function Grid() {
  /** 핵심: serverMeta를 Grid state로 관리 */
  const [serverMeta, setServerMeta] = useState(null);

  /** 펼침/접힘 상태 */
  const [expandedMap, setExpandedMap] = useState({});

  /** 셀렉트 상태 (Grid 내부라고 가정) */
  const [selectMode, setSelectMode] = useState('');

  /** 조회 버튼 */
  const fnSearch = () => {
    // 조회 조건 세팅 (생략)
    // const searchCond = settingSearchCond();

    // serverMeta 계산
    const meta = getServerMeta();

    // 반드시 state로 올린다
    setServerMeta(meta);

    // 조회 시 셀렉트 초기화
    setSelectMode('');
  };

  /**
   * expandColumns → 그룹핑
   */
  const grouped = useMemo(() => {
    if (!serverMeta) return {};

    return serverMeta.expandColumns.reduce((acc, cur) => {
      const { groupKey, children } = cur;
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(children);
      return acc;
    }, {});
  }, [serverMeta]);

  /**
   * grouped 변경 시 expandedMap 초기화
   */
  useEffect(() => {
    if (!serverMeta) {
      setExpandedMap({});
      return;
    }

    const init = {};
    Object.keys(grouped).forEach(k => {
      init[k] = false;
    });

    setExpandedMap(init);
  }, [grouped, serverMeta]);

  /**
   * 셀렉트 전체 펼침/접힘
   */
  useEffect(() => {
    if (selectMode !== 'Y' && selectMode !== 'N') return;

    setExpandedMap(prev => {
      const next = {};
      Object.keys(prev).forEach(k => {
        next[k] = selectMode === 'Y';
      });
      return next;
    });
  }, [selectMode]);

  /**
   * 개별 아이콘 클릭
   */
  const handleIconClick = useCallback(groupKey => {
    setExpandedMap(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
    setSelectMode('');
  }, []);

  /**
   * columnDefs 계산
   */
  const columnDefs = useMemo(() => {
    if (!serverMeta) return [];

    const cols = [];

    /** 기본 컬럼 */
    serverMeta.baseColumns.forEach(col => {
      cols.push({
        field: col,
        width: 120,
      });
    });

    /** M / W 컬럼 */
    Object.entries(grouped).forEach(([groupKey, children]) => {
      // 부모(M)
      cols.push({
        colId: `TOGGLE_${groupKey}`,
        headerComponent: CustomHeader,
        headerComponentParams: {
          label: groupKey,
          expanded: expandedMap[groupKey],
          onIconClick: () => handleIconClick(groupKey),
        },
        valueGetter: () => '',
        width: 90,
        suppressMenu: true,
        sortable: false,
        filter: false,
      });

      // 자식(W)
      children.forEach(child => {
        cols.push({
          field: child,
          hide: !expandedMap[groupKey],
          width: 100,
        });
      });
    });

    return cols;
  }, [serverMeta, grouped, expandedMap, handleIconClick]);

  return (
    <div style={{ padding: 16 }}>
      {/* 조회 UI */}
      <select
        value={selectMode}
        onChange={e => setSelectMode(e.target.value)}
      >
        <option value="">기본</option>
        <option value="Y">펼치기</option>
        <option value="N">접기</option>
      </select>

      <button onClick={fnSearch} style={{ marginLeft: 8 }}>
        조회
      </button>

      {/* Grid */}
      <div className="ag-theme-alpine" style={{ height: 350, marginTop: 12 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true }}
        />
      </div>
    </div>
  );
}




