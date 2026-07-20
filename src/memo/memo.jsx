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
