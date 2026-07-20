export default function DynamicPeriodGridVersion3() {
  const [fixedGroupHeaderName, setFixedGroupHeaderName] =
    useState("기본 헤더명");

  const [rowData, setRowData] = useState([]);

  const fixedColumnDefs = useMemo(
    () =>
      createFixedColumnDefs(
        fixedGroupHeaderName,
      ),
    [fixedGroupHeaderName],
  );

  const businessColumnConfig = useMemo(
    () =>
      createBusinessColumnConfig({
        numberFormatter,
      }),
    [numberFormatter],
  );

  const dynamicColumnDefs = useMemo(
    () =>
      createDynamicColumnDefs(
        businessColumnConfig,
        rowData,
      ),
    [businessColumnConfig, rowData],
  );

  const columnDefs = useMemo(
    () => [
      ...fixedColumnDefs,
      ...standaloneColumnDefs,
      ...dynamicColumnDefs,
    ],
    [
      fixedColumnDefs,
      standaloneColumnDefs,
      dynamicColumnDefs,
    ],
  );

  const handleSearch = () => {
    if (!Object.values(periodSelection).some(Boolean)) {
      alert("조회 기간을 하나 이상 선택하세요.");
      return;
    }

    let nextHeaderName;

    if (조건식) {
      nextHeaderName = "조건 A 헤더";
    } else {
      nextHeaderName = "조건 B 헤더";
    }

    setFixedGroupHeaderName(nextHeaderName);

    setRowData(
      createDummyResponseRows({
        periodSelection,
        includeComparison,
        selectedAdditionalBusinesses,
      }),
    );
  };

  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
    />
  );
}



======================================

  function SampleGridPage() {
  const [fixedGroupHeaderName, setFixedGroupHeaderName] =
    useState("BASE");

  const getFixedCellStyle = useCallback((params) => {
    if (params.value === "APP") {
      return {
        backgroundColor: "#f0f0f0",
      };
    }

    return null;
  }, []);

  function createFixedColumnDefs(headerName) {
    return [
      {
        headerName: "사업장",
        field: "companyName",
        colId: "companyName",
        pinned: "left",
        width: 125,
      },
      {
        headerName: "제품",
        field: "productName",
        colId: "productName",
        pinned: "left",
        width: 110,
      },
      {
        headerName,
        groupId: "UPPER2_GROUP",
        marryChildren: true,
        children: [
          {
            headerName: "구분1",
            field: "UPPER2_CD1",
            colId: "UPPER2_CD1",
            pinned: "left",
            width: 110,
            cellStyle: getFixedCellStyle,
          },
          {
            headerName: "구분2",
            field: "UPPER2_CD2",
            colId: "UPPER2_CD2",
            pinned: "left",
            width: 110,
            cellStyle: getFixedCellStyle,
          },
        ],
      },
    ];
  }

  const fixedColumnDefs = useMemo(
    () => createFixedColumnDefs(fixedGroupHeaderName),
    [fixedGroupHeaderName, getFixedCellStyle],
  );

  // ...
}



function createFixedColumnDefs(headerName) {
  return [
    {
      headerName,
      cellStyle: getFixedCellStyle,
    },
  ];
}


const fixedColumnDefs = useMemo(
  () => createFixedColumnDefs(fixedGroupHeaderName),
  [fixedGroupHeaderName, getFixedCellStyle],
);


const fixedColumnDefs = useMemo(
  () => createFixedColumnDefs(fixedGroupHeaderName),
  [fixedGroupHeaderName, getFixedCellStyle],
);



function createFixedColumnDefs({
  fixedGroupHeaderName,
  getFixedCellStyle,
}) {
  return [
    {
      headerName: fixedGroupHeaderName,
      groupId: "UPPER2_GROUP",
      children: [
        {
          headerName: "구분1",
          field: "UPPER2_CD1",
          cellStyle: getFixedCellStyle,
        },
        {
          headerName: "구분2",
          field: "UPPER2_CD2",
          cellStyle: getFixedCellStyle,
        },
      ],
    },
  ];
}


const fixedColumnDefs = useMemo(
  () =>
    createFixedColumnDefs({
      fixedGroupHeaderName,
      getFixedCellStyle,
    }),
  [fixedGroupHeaderName, getFixedCellStyle],
);


const fixedColumnDefs = useMemo(() => {
  function createFixedColumnDefs(headerName) {
    return [
      {
        headerName,
        children: [
          {
            field: "UPPER2_CD1",
            cellStyle: getFixedCellStyle,
          },
          {
            field: "UPPER2_CD2",
            cellStyle: getFixedCellStyle,
          },
        ],
      },
    ];
  }

  return createFixedColumnDefs(fixedGroupHeaderName);
}, [fixedGroupHeaderName, getFixedCellStyle]);



const fixedColumnDefs = useMemo(
  () => createFixedColumnDefs(fixedGroupHeaderName),
  [
    fixedGroupHeaderName,
    getFixedCellStyle,
    // createFixedColumnDefs 내부에서 사용하는
    // 다른 useCallback 함수가 있다면 추가
  ],
);

const columnDefs = useMemo(
  () => [
    ...fixedColumnDefs,
    ...dynamicColumnDefs,
  ],
  [fixedColumnDefs, dynamicColumnDefs],
);
