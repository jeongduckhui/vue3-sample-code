import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const CallTracePopup = ({ callInfos }) => {
  const [selectedSql, setSelectedSql] = useState('');

  // ✅ AG Grid 컬럼 정의
  const columnDefs = useMemo(() => [
    {
      headerName: '호출구분',
      field: 'callType',
      width: 100,
    },
    {
      headerName: '호출시간',
      field: 'callTime',
      width: 160,
    },
    {
      headerName: '서버시간(ms)',
      field: 'serverTimeMs',
      width: 130,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: 'UI시간(ms)',
      field: 'uiTimeMs',
      width: 120,
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: '총소요(ms)',
      field: 'totalTimeMs',
      width: 120,
      cellStyle: { textAlign: 'right', fontWeight: 'bold' },
    },
  ], []);

  // ✅ 행 클릭 시 SQL textarea에 표시
  const onRowClicked = params => {
    setSelectedSql(params.data.sql);
  };

  return (
    <div style={{ width: 900 }}>
      {/* 호출 정보 그리드 */}
      <div
        className="ag-theme-alpine"
        style={{ height: 250, width: '100%' }}
      >
        <AgGridReact
          rowData={callInfos}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            resizable: true,
          }}
          rowSelection="single"
          onRowClicked={onRowClicked}
        />
      </div>

      {/* SQL 표시 영역 */}
      <div style={{ marginTop: 12 }}>
        <label style={{ fontWeight: 'bold' }}>쿼리</label>
        <textarea
          value={selectedSql}
          readOnly
          style={{
            width: '100%',
            height: 150,
            marginTop: 4,
            fontFamily: 'monospace',
            fontSize: 13,
            padding: 8,
          }}
        />
      </div>
    </div>
  );
};

export default CallTracePopup;
