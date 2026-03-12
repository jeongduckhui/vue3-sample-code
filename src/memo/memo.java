import { useState, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

function PermissionGrid() {
  const gridRef = useRef();

  const permissionGroups = useMemo(() => createPermissionGroups(), []);

  const permissionColumns = useMemo(
    () => permissionGroups.flatMap((g) => g.columns),
    [permissionGroups],
  );

  const [rowData, setRowData] = useState(createDummy(permissionGroups));

  const [deletedRows, setDeletedRows] = useState([]);

  // 체크박스 renderer
  const CheckboxRenderer = (props) => {
    const checked = props.value === "1";
    return <input type="checkbox" checked={checked} readOnly />;
  };

  // 컬럼 정의
  const columnDefs = useMemo(() => {
    const base = [
      { field: "permCode", headerName: "권한코드", editable: true, width: 120 },
      { field: "permName", headerName: "권한명", editable: true, width: 150 },
      { field: "permDesc", headerName: "권한설명", editable: true, width: 200 },
    ];

    const perm1Group = {
      headerName: "권한1",

      children: [
        createAllColumn("g1"),

        ...permissionGroups
          .find((g) => g.groupKey === "perm1")
          .columns.map((c) => createPermissionColumn(c)),
      ],
    };

    const perm2AllColumn = createAllColumn("g2");

    const perm2Group = {
      headerName: "권한2",

      children: permissionGroups
        .find((g) => g.groupKey === "perm2")
        .columns.map((c) => createPermissionColumn(c)),
    };

    const perm3Group = {
      headerName: "권한3",

      children: permissionGroups
        .find((g) => g.groupKey === "perm3")
        .columns.map((c) => createPermissionColumn(c)),
    };

    return [...base, perm1Group, perm2AllColumn, perm2Group, perm3Group];
  }, [permissionGroups]);

  function createAllColumn(controlGroupKey) {
    return {
      field: `${controlGroupKey}_all`,
      headerName: "All",
      controlGroupKey,
      isAll: true,
      cellRenderer: CheckboxRenderer,
      width: 90,
    };
  }

  function createPermissionColumn(col) {
    return {
      field: col.field,
      headerName: col.headerName,
      controlGroupKey: col.controlGroupKey,
      cellRenderer: CheckboxRenderer,
      width: 90,
    };
  }

  // ALL 상태 계산
  const updateAllState = (node, controlGroupKey) => {
    const data = node.data;

    const cols = permissionColumns.filter(
      (c) => c.controlGroupKey === controlGroupKey,
    );

    const allChecked = cols.every((c) => data[c.field] === "1");

    node.setDataValue(`${controlGroupKey}_all`, allChecked ? "1" : "0");
  };

  // 클릭 처리
  const onCellClicked = (params) => {
    const colDef = params.colDef;

    if (!colDef.controlGroupKey) return;

    const node = params.node;
    const data = node.data;

    const controlColumns = permissionColumns.filter(
      (c) => c.controlGroupKey === colDef.controlGroupKey,
    );

    if (colDef.isAll) {
      const checked = data[colDef.field] === "1";

      controlColumns.forEach((c) => {
        node.setDataValue(c.field, checked ? "0" : "1");
      });

      node.setDataValue(colDef.field, checked ? "0" : "1");

      return;
    }

    const field = colDef.field;

    const newValue = data[field] === "1" ? "0" : "1";

    node.setDataValue(field, newValue);

    updateAllState(node, colDef.controlGroupKey);
  };

  // 수정 감지
  const onCellValueChanged = (params) => {
    const data = params.data;

    if (data._state !== "added") {
      data._state = "updated";
    }
  };

  // 행 추가
  const addRow = () => {
    const newRow = {
      id: Date.now(),

      permCode: "NEW",
      permName: "신규권한",
      permDesc: "신규 생성",

      g1_all: "0",
      g2_all: "0",

      _state: "added",
    };

    permissionColumns.forEach((c) => {
      newRow[c.field] = "0";
    });

    gridRef.current.api.applyTransaction({
      add: [newRow],
    });
  };

  // 행 삭제
  const deleteRow = () => {
    const rows = gridRef.current.api.getSelectedRows();

    if (!rows.length) return;

    setDeletedRows((prev) => [...prev, ...rows]);

    gridRef.current.api.applyTransaction({
      remove: rows,
    });
  };

  // 저장
  const save = () => {
    const added = [];
    const updated = [];

    gridRef.current.api.forEachNode((node) => {
      const data = node.data;

      if (data._state === "added") {
        added.push(data);
      } else if (data._state === "updated") {
        updated.push(data);
      }
    });

    const result = {
      added,
      updated,
      deleted: deletedRows,
    };

    console.log("SAVE RESULT");
    console.log(result);

    alert("콘솔 확인");
  };

  const defaultColDef = {
    resizable: true,
    editable: true,
  };

  return (
    <div style={{ width: "100vw", height: "100vh", padding: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={addRow}>행 추가</button>
        <button onClick={deleteRow}>행 삭제</button>
        <button onClick={save}>저장</button>
      </div>

      <div
        className="ag-theme-quartz"
        style={{ width: "100%", height: "calc(100vh - 100px)" }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          onCellClicked={onCellClicked}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}

// 권한 메타데이터
function createPermissionGroups() {
  return [
    {
      groupKey: "perm1",
      columns: [
        { field: "read", headerName: "읽기", controlGroupKey: "g1" },
        { field: "write", headerName: "쓰기", controlGroupKey: "g1" },
        { field: "delete", headerName: "삭제", controlGroupKey: "g1" },
        { field: "create", headerName: "추가", controlGroupKey: "g1" },
      ],
    },

    {
      groupKey: "perm2",
      columns: [
        { field: "modify", headerName: "변경", controlGroupKey: "g2" },
        { field: "save", headerName: "저장", controlGroupKey: "g2" },
      ],
    },

    {
      groupKey: "perm3",
      columns: [
        { field: "hide", headerName: "숨기기", controlGroupKey: "g2" },
        { field: "show", headerName: "보이기", controlGroupKey: "g2" },
      ],
    },
  ];
}

// 더미 데이터
function createDummy(groups) {
  const list = [];

  for (let i = 1; i <= 20; i++) {
    const row = {
      permCode: `PERM_${i}`,
      permName: `권한${i}`,
      permDesc: `권한 설명 ${i}`,

      g1_all: "0",
      g2_all: "0",
    };

    groups.forEach((g) => {
      g.columns.forEach((c) => {
        row[c.field] = Math.random() > 0.5 ? "1" : "0";
      });
    });

    list.push(row);
  }

  return list;
}

export default PermissionGrid;
