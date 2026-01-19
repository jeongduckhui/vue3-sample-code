import React, { useState } from 'react';
import BigPopup from './BigPopup';

const ParentPage = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({ id: '', name: '' });

  return (
    <>
      <button onClick={() => setOpen(true)}>팝업 열기</button>

      {open && (
        <BigPopup
          value={value}
          onChange={setValue}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ParentPage;
=====================================================
  import React, { useState } from 'react';
import SmallPopup from './SmallPopup';

const BigPopup = ({ value, onChange, onClose }) => {
  const [smallOpen, setSmallOpen] = useState(false);

  return (
    <div style={{ border: '2px solid #333', padding: 20 }}>
      <h3>멀티셀렉트 모음 팝업</h3>

      {/* 실제로는 30개 */}
      <div>
        <label>상품 코드</label>
        <input
          readOnly
          value={value.id}
          onClick={() => setSmallOpen(true)}
        />
      </div>

      {smallOpen && (
        <SmallPopup
          initialValue={value}
          onApply={onChange}
          onClose={() => setSmallOpen(false)}
        />
      )}

      <br />
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default BigPopup;
=======================================================================
import React, { useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const rowData = [
  { code: 'M10' },
  { code: 'C2' },
  { code: 'D12' },
  { code: 'H5' },
  { code: 'P3' },
];

const columnDefs = [
  {
    headerName: '',
    checkboxSelection: true,
    width: 50,
  },
  { field: 'code', headerName: '코드' },
];

const SmallPopup = ({ initialValue, onApply, onClose }) => {
  const gridApiRef = useRef(null);

  // 팝업 열릴 때 기존 선택값 복원
  useEffect(() => {
    if (!gridApiRef.current) return;

    const selectedSet = new Set(
      initialValue.id
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
    );

    gridApiRef.current.forEachNode(node => {
      node.setSelected(selectedSet.has(node.data.code));
    });
  }, [initialValue]);

  // 적용 버튼 클릭 (정답 포인트)
  const handleApply = () => {
    const rows = gridApiRef.current.getSelectedRows();

    const values = rows.map(r => r.code);
    const joined = values.join(', ');

    onApply({
      id: joined,
      name: joined,
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: 100,
        background: '#fff',
        border: '2px solid #333',
        padding: 10,
      }}
    >
      <h4>상품 코드 선택</h4>

      <div
        className="ag-theme-alpine"
        style={{ height: 200, width: 250 }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onGridReady={params => {
            gridApiRef.current = params.api;
          }}
        />
      </div>

      <br />
      <button onClick={handleApply}>적용하기</button>
      <button onClick={onClose}>취소</button>
    </div>
  );
};

export default SmallPopup;

=============================================

  🧠 AG-Grid에서 반드시 써야 하는 값
❌ 쓰면 안 되는 것 (지금 상황)
selectedNodes 누적 배열

selection 이벤트에서 내려오는 delta 느낌의 값

✅ 써야 하는 것
gridApi.getSelectedNodes()
또는

gridApi.getSelectedRows()
이 두 개는 “현재 체크된 행만” 반환한다.

체크 해제 시
gridApi.getSelectedRows()
현재 체크된 행만 반환

누적값 없음

유령 값 없음
