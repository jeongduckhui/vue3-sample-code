"use client";

import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import {
  ClientSideRowModelModule,
  ValidationModule,
} from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

const BASE_REVISION = {
  revisionCode: "REVISION_1",
  headerName: "리비전1",
  orderIndex: 1,
};

const COMPARISON_REVISION = {
  revisionCode: "REVISION_2",
  headerName: "리비전2",
  orderIndex: 2,
};

const REVISION_TYPE = {
  BASE: "BASE",
  COMPARISON: "COMPARISON",
};

const PERIOD_TYPE_ORDER = {
  M: 1,
  Q: 2,
  H: 3,
  Y: 4,
};

const ADDITIONAL_BUSINESS_CONFIG = {
  standaloneBusiness1: {
    headerName: "추가업무1",
    field: "extraBusiness1",
    width: 115,
  },
  standaloneBusiness2: {
    parentHeaderName: "Net Die",
    headerName: "추가업무2",
    field: "extraBusiness2",
    width: 115,
  },
  dynamicBusiness3: {
    businessCode: "extra_business3",
    headerName: "추가업무3",
  },
  dynamicBusiness4: {
    businessCode: "extra_business4",
    headerName: "추가업무4",
  },
};

const BUSINESS_COLUMN_CONFIG = {
  extra_business3: {
    orderIndex: -2,
    headerName: "추가업무3",
    width: 108,
    numberFormat: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    cellStyle: (params) => {
      const value = Number(params.value);

      if (!Number.isNaN(value) && value >= 500) {
        return {
          backgroundColor: "#e6f4ff",
          color: "#0958d9",
          fontWeight: "600",
        };
      }

      return null;
    },
  },

  extra_business4: {
    orderIndex: -1,
    headerName: "추가업무4",
    width: 108,
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    cellStyle: (params) => {
      const value = Number(params.value);

      if (!Number.isNaN(value) && value < 0) {
        return {
          backgroundColor: "#fff1f0",
          color: "#cf1322",
          fontWeight: "600",
        };
      }

      return null;
    },
  },

  sale: {
    orderIndex: 1,
    headerName: "매출",
    width: 102,
    numberFormat: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    cellStyle: (params) => {
      const value = Number(params.value);

      if (!Number.isNaN(value) && value >= 200000) {
        return {
          backgroundColor: "#fff7d6",
          fontWeight: "600",
        };
      }

      return null;
    },
  },

  purchase: {
    orderIndex: 2,
    headerName: "매입",
    width: 102,
    numberFormat: {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    cellStyle: (params) => {
      if (params.data?.warningYn === "Y") {
        return {
          backgroundColor: "#fff1f0",
        };
      }

      return null;
    },
  },

  sale_profit: {
    orderIndex: 3,
    headerName: "영업이익",
    width: 110,
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    cellStyle: (params) => {
      const value = Number(params.value);

      if (!Number.isNaN(value) && value < 0) {
        return {
          backgroundColor: "#ffe5e5",
          color: "#cf1322",
          fontWeight: "600",
        };
      }

      return null;
    },
  },

  inventory: {
    orderIndex: 4,
    headerName: "재고율",
    width: 100,
    numberFormat: {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    suffix: "%",
    cellStyle: (params) => {
      const value = Number(params.value);

      if (!Number.isNaN(value) && value >= 90) {
        return {
          backgroundColor: "#fff2cc",
          color: "#8a5a00",
          fontWeight: "600",
        };
      }

      return null;
    },
  },
};

const DEFAULT_BUSINESS_CONFIG = {
  orderIndex: 9999,
  headerName: "",
  width: 100,
  numberFormat: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
};

const FIXED_COLUMN_DEFS = [
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
];

const FIXED_FIELDS = [
  "companyCode",
  "companyName",
  "productCode",
  "productName",
  "warningYn",
  "extraBusiness1",
  "extraBusiness2",
];

function createBusinessValues({
  businessCode,
  year,
  monthlyValues,
  quarterValues,
  halfValues,
  yearlyValue,
  isComparison,
}) {
  const values = {};
  const suffix = isComparison
    ? `comp_${businessCode}`
    : businessCode;

  monthlyValues.forEach((value, index) => {
    const number = String(index + 1).padStart(2, "0");
    values[`M${year}${number}_${suffix}`] = value;
  });

  quarterValues.forEach((value, index) => {
    const number = String(index + 1).padStart(2, "0");
    values[`Q${year}${number}_${suffix}`] = value;
  });

  halfValues.forEach((value, index) => {
    const number = String(index + 1).padStart(2, "0");
    values[`H${year}${number}_${suffix}`] = value;
  });

  values[`Y${year}_${suffix}`] = yearlyValue;

  return values;
}

function createPeriodValues({
  seed,
  multiplier,
  offset,
  makeNegative = false,
}) {
  const saleMonths = Array.from(
    { length: 6 },
    (_, index) =>
      Math.round((seed + index * 17000) * multiplier),
  );

  const purchaseMonths = Array.from(
    { length: 6 },
    (_, index) =>
      Math.round(
        (seed * 0.72 + index * 12000) * multiplier,
      ),
  );

  const profitMonths = saleMonths.map(
    (sale, index) =>
      Number(
        (
          sale -
          purchaseMonths[index] -
          seed * 0.08 +
          offset
        ).toFixed(3),
      ),
  );

  const inventoryMonths = Array.from(
    { length: 6 },
    (_, index) =>
      Number(
        (
          62 +
          ((seed / 1000 + index * 4.7) % 37) +
          offset
        ).toFixed(3),
      ),
  );

  const extra3Months = Array.from(
    { length: 6 },
    (_, index) =>
      Math.round((seed / 300 + index * 75) * multiplier),
  );

  const extra4Months = Array.from(
    { length: 6 },
    (_, index) =>
      Number(
        (
          (seed / 5000 - index * 1.75) * multiplier +
          offset
        ).toFixed(3),
      ),
  );

  if (makeNegative) {
    profitMonths[0] = -8500.75;
    extra4Months[5] = -12.55;
  }

  const sum = (values) =>
    values.reduce((total, value) => total + value, 0);

  const average = (values) =>
    Number((sum(values) / values.length).toFixed(3));

  const saleQuarters = [
    sum(saleMonths.slice(0, 3)),
    sum(saleMonths.slice(3, 6)),
    Math.round(seed * 3.8 * multiplier),
    Math.round(seed * 4.15 * multiplier),
  ];

  const purchaseQuarters = [
    sum(purchaseMonths.slice(0, 3)),
    sum(purchaseMonths.slice(3, 6)),
    Math.round(seed * 2.65 * multiplier),
    Math.round(seed * 2.9 * multiplier),
  ];

  const profitQuarters = saleQuarters.map(
    (sale, index) =>
      Number(
        (
          sale -
          purchaseQuarters[index] -
          seed * 0.12 +
          offset
        ).toFixed(3),
      ),
  );

  const inventoryQuarters = [
    average(inventoryMonths.slice(0, 3)),
    average(inventoryMonths.slice(3, 6)),
    Number((78.125 + offset).toFixed(3)),
    Number((84.555 + offset).toFixed(3)),
  ];

  const extra3Quarters = [
    sum(extra3Months.slice(0, 3)),
    sum(extra3Months.slice(3, 6)),
    Math.round(seed / 85),
    Math.round(seed / 78),
  ];

  const extra4Quarters = [
    average(extra4Months.slice(0, 3)),
    average(extra4Months.slice(3, 6)),
    Number((seed / 6200).toFixed(3)),
    Number((seed / 6800).toFixed(3)),
  ];

  const createSumHalves = (quarters) => [
    quarters[0] + quarters[1],
    quarters[2] + quarters[3],
  ];

  const createAverageHalves = (quarters) => [
    Number(((quarters[0] + quarters[1]) / 2).toFixed(3)),
    Number(((quarters[2] + quarters[3]) / 2).toFixed(3)),
  ];

  const saleHalves = createSumHalves(saleQuarters);
  const purchaseHalves = createSumHalves(purchaseQuarters);
  const profitHalves = createSumHalves(profitQuarters);
  const inventoryHalves =
    createAverageHalves(inventoryQuarters);
  const extra3Halves = createSumHalves(extra3Quarters);
  const extra4Halves =
    createAverageHalves(extra4Quarters);

  return {
    extra_business3: {
      monthlyValues: extra3Months,
      quarterValues: extra3Quarters,
      halfValues: extra3Halves,
      yearlyValue: sum(extra3Halves),
    },
    extra_business4: {
      monthlyValues: extra4Months,
      quarterValues: extra4Quarters,
      halfValues: extra4Halves,
      yearlyValue: average(extra4Halves),
    },
    sale: {
      monthlyValues: saleMonths,
      quarterValues: saleQuarters,
      halfValues: saleHalves,
      yearlyValue: sum(saleHalves),
    },
    purchase: {
      monthlyValues: purchaseMonths,
      quarterValues: purchaseQuarters,
      halfValues: purchaseHalves,
      yearlyValue: sum(purchaseHalves),
    },
    sale_profit: {
      monthlyValues: profitMonths,
      quarterValues: profitQuarters,
      halfValues: profitHalves,
      yearlyValue: Number(sum(profitHalves).toFixed(3)),
    },
    inventory: {
      monthlyValues: inventoryMonths,
      quarterValues: inventoryQuarters,
      halfValues: inventoryHalves,
      yearlyValue: average(inventoryHalves),
    },
  };
}

function createDummyRow(definition) {
  const row = {
    ...definition,
    extraBusiness1: Math.round(definition.baseSeed / 100),
    extraBusiness2: Number(
      (definition.baseSeed / 10000).toFixed(2),
    ),
  };

  delete row.baseSeed;

  const baseValues = createPeriodValues({
    seed: definition.baseSeed,
    multiplier: 1,
    offset: 0.37,
  });

  const comparisonValues = createPeriodValues({
    seed: definition.baseSeed,
    multiplier: 0.91,
    offset: 0.82,
    makeNegative: definition.companyCode === "C002",
  });

  Object.entries(baseValues).forEach(
    ([businessCode, periodValues]) => {
      Object.assign(
        row,
        createBusinessValues({
          businessCode,
          year: "2026",
          ...periodValues,
          isComparison: false,
        }),
      );
    },
  );

  Object.entries(comparisonValues).forEach(
    ([businessCode, periodValues]) => {
      Object.assign(
        row,
        createBusinessValues({
          businessCode,
          year: "2026",
          ...periodValues,
          isComparison: true,
        }),
      );
    },
  );

  return row;
}

const ALL_DUMMY_ROWS = [
  {
    companyCode: "C001",
    companyName: "서울사업장",
    productCode: "P001",
    productName: "제품 A",
    warningYn: "N",
    baseSeed: 112000,
  },
  {
    companyCode: "C002",
    companyName: "이천사업장",
    productCode: "P002",
    productName: "제품 B",
    warningYn: "Y",
    baseSeed: 97000,
  },
  {
    companyCode: "C003",
    companyName: "청주사업장",
    productCode: "P003",
    productName: "제품 C",
    warningYn: "N",
    baseSeed: 158000,
  },
  {
    companyCode: "C004",
    companyName: "구미사업장",
    productCode: "P004",
    productName: "제품 D",
    warningYn: "N",
    baseSeed: 131000,
  },
  {
    companyCode: "C005",
    companyName: "용인사업장",
    productCode: "P005",
    productName: "제품 E",
    warningYn: "Y",
    baseSeed: 184000,
  },
  {
    companyCode: "C006",
    companyName: "수원사업장",
    productCode: "P006",
    productName: "제품 F",
    warningYn: "N",
    baseSeed: 145000,
  },
].map(createDummyRow);

function isEmptyValue(value) {
  return value === null || value === undefined || value === "";
}

function getBusinessConfig(businessCode) {
  return (
    BUSINESS_COLUMN_CONFIG[businessCode] ?? {
      ...DEFAULT_BUSINESS_CONFIG,
      headerName: businessCode,
    }
  );
}

function parseDynamicColumnField(field) {
  const match = field.match(
    /^(Y|H|Q|M)(\d{4})(\d{2})?_(?:(comp)_)?(.+)$/i,
  );

  if (!match) {
    return null;
  }

  const [
    ,
    periodTypeText,
    year,
    periodNumberText,
    comparisonMarker,
    businessCode,
  ] = match;

  const periodType = periodTypeText.toUpperCase();
  const periodNumber = periodNumberText
    ? Number(periodNumberText)
    : null;

  return {
    field,
    revisionType: comparisonMarker
      ? REVISION_TYPE.COMPARISON
      : REVISION_TYPE.BASE,
    periodType,
    year,
    periodNumber,
    businessCode,
    periodHeaderName:
      periodType === "M"
        ? `${periodNumber}월`
        : periodType === "Q"
          ? `${periodNumber}분기`
          : periodType === "H"
            ? periodNumber === 1
              ? "상반기"
              : "하반기"
            : null,
  };
}

function createDummyResponseRows({
  periodSelection,
  includeComparison,
  selectedAdditionalBusinesses,
}) {
  const selectedPeriodTypes = Object.entries(
    periodSelection,
  )
    .filter(([, selected]) => selected)
    .map(([periodType]) => periodType);

  const selectedDynamicCodes = [];

  if (selectedAdditionalBusinesses.dynamicBusiness3) {
    selectedDynamicCodes.push("extra_business3");
  }

  if (selectedAdditionalBusinesses.dynamicBusiness4) {
    selectedDynamicCodes.push("extra_business4");
  }

  return ALL_DUMMY_ROWS.map((row) => {
    const nextRow = {};

    Object.entries(row).forEach(([field, value]) => {
      if (FIXED_FIELDS.includes(field)) {
        nextRow[field] = value;
        return;
      }

      const parsed = parseDynamicColumnField(field);

      if (!parsed) {
        return;
      }

      const isExtraDynamic = [
        "extra_business3",
        "extra_business4",
      ].includes(parsed.businessCode);

      const allowed =
        selectedPeriodTypes.includes(parsed.periodType) &&
        (parsed.revisionType === REVISION_TYPE.BASE ||
          includeComparison) &&
        (!isExtraDynamic ||
          selectedDynamicCodes.includes(parsed.businessCode));

      if (allowed) {
        nextRow[field] = value;
      }
    });

    return nextRow;
  });
}

function groupBy(items, keySelector) {
  const map = new Map();

  items.forEach((item) => {
    const key = keySelector(item);

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(item);
  });

  return map;
}

function getRevisionConfig(revisionType) {
  return revisionType === REVISION_TYPE.BASE
    ? BASE_REVISION
    : COMPARISON_REVISION;
}

function formatBusinessValue(config) {
  return (params) => {
    if (isEmptyValue(params.value)) {
      return "";
    }

    const numberValue = Number(params.value);

    if (Number.isNaN(numberValue)) {
      return params.value;
    }

    const formatted = numberValue.toLocaleString(
      "ko-KR",
      config.numberFormat ??
        DEFAULT_BUSINESS_CONFIG.numberFormat,
    );

    return config.suffix
      ? `${formatted}${config.suffix}`
      : formatted;
  };
}

function createLeafColumn(column, headerName) {
  const config = getBusinessConfig(column.businessCode);

  return {
    headerName,
    field: column.field,
    colId: column.field,
    width: config.width ?? 100,
    minWidth: 84,
    sortable: false,
    resizable: true,
    valueFormatter: formatBusinessValue(config),
    cellStyle: (params) =>
      config.cellStyle?.(params) ?? null,
  };
}

function createDetailYearGroups(
  columns,
  revisionType,
  businessCode,
) {
  const yearMap = groupBy(columns, (column) => column.year);

  return [...yearMap.entries()]
    .sort(
      ([yearA], [yearB]) =>
        Number(yearA) - Number(yearB),
    )
    .map(([year, yearColumns]) => ({
      headerName: `${year}년`,
      groupId:
        `DETAIL_${revisionType}_${businessCode}_${year}`,
      marryChildren: true,
      children: [...yearColumns]
        .sort((a, b) => {
          const typeCompare =
            PERIOD_TYPE_ORDER[a.periodType] -
            PERIOD_TYPE_ORDER[b.periodType];

          return typeCompare !== 0
            ? typeCompare
            : (a.periodNumber ?? 0) -
                (b.periodNumber ?? 0);
        })
        .map((column) =>
          createLeafColumn(
            column,
            column.periodHeaderName,
          ),
        ),
    }));
}

function createBusinessGroups(
  revisionType,
  revisionColumns,
) {
  const businessMap = groupBy(
    revisionColumns,
    (column) => column.businessCode,
  );

  return [...businessMap.entries()]
    .sort(([codeA], [codeB]) => {
      const configA = getBusinessConfig(codeA);
      const configB = getBusinessConfig(codeB);

      return (
        configA.orderIndex - configB.orderIndex ||
        codeA.localeCompare(codeB)
      );
    })
    .map(([businessCode, businessColumns]) => {
      const config = getBusinessConfig(businessCode);

      const detailColumns = businessColumns.filter(
        (column) => column.periodType !== "Y",
      );

      const yearlyColumns = businessColumns
        .filter((column) => column.periodType === "Y")
        .sort(
          (a, b) => Number(a.year) - Number(b.year),
        );

      return {
        headerName: config.headerName,
        groupId:
          `BUSINESS_${revisionType}_${businessCode}`,
        marryChildren: true,
        children: [
          ...createDetailYearGroups(
            detailColumns,
            revisionType,
            businessCode,
          ),
          ...yearlyColumns.map((column) =>
            createLeafColumn(
              column,
              `${column.year}년`,
            ),
          ),
        ],
      };
    });
}

function createDynamicColumnDefs(rowData) {
  if (!rowData?.length) {
    return [];
  }

  const parsedColumns = Object.keys(rowData[0])
    .filter((field) => !FIXED_FIELDS.includes(field))
    .map(parseDynamicColumnField)
    .filter(Boolean);

  const revisionMap = groupBy(
    parsedColumns,
    (column) => column.revisionType,
  );

  return [...revisionMap.entries()]
    .sort(([typeA], [typeB]) => {
      return (
        getRevisionConfig(typeA).orderIndex -
        getRevisionConfig(typeB).orderIndex
      );
    })
    .map(([revisionType, revisionColumns]) => {
      const revision =
        getRevisionConfig(revisionType);

      return {
        headerName: revision.headerName,
        groupId: `REVISION_${revision.revisionCode}`,
        marryChildren: true,
        children: createBusinessGroups(
          revisionType,
          revisionColumns,
        ),
      };
    });
}

function createStandaloneAdditionalColumnDefs(selection) {
  const columnDefs = [];

  if (selection.standaloneBusiness1) {
    const config =
      ADDITIONAL_BUSINESS_CONFIG.standaloneBusiness1;

    columnDefs.push({
      headerName: config.headerName,
      field: config.field,
      colId: config.field,
      width: config.width,
      valueFormatter: (params) =>
        isEmptyValue(params.value)
          ? ""
          : Number(params.value).toLocaleString("ko-KR"),
    });
  }

  if (selection.standaloneBusiness2) {
    const config =
      ADDITIONAL_BUSINESS_CONFIG.standaloneBusiness2;

    columnDefs.push({
      headerName: config.parentHeaderName,
      groupId: "ADDITIONAL_NET_DIE",
      children: [
        {
          headerName: config.headerName,
          field: config.field,
          colId: config.field,
          width: config.width,
          valueFormatter: (params) =>
            isEmptyValue(params.value)
              ? ""
              : Number(params.value).toLocaleString(
                  "ko-KR",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                ),
        },
      ],
    });
  }

  return columnDefs;
}

export default function DynamicPeriodGridVersion3() {
  const [periodSelection, setPeriodSelection] = useState({
    M: true,
    Q: true,
    H: true,
    Y: true,
  });

  const [includeComparison, setIncludeComparison] =
    useState(true);

  const [
    selectedAdditionalBusinesses,
    setSelectedAdditionalBusinesses,
  ] = useState({
    standaloneBusiness1: true,
    standaloneBusiness2: true,
    dynamicBusiness3: true,
    dynamicBusiness4: true,
  });

  const [rowData, setRowData] = useState(() =>
    createDummyResponseRows({
      periodSelection: {
        M: true,
        Q: true,
        H: true,
        Y: true,
      },
      includeComparison: true,
      selectedAdditionalBusinesses: {
        standaloneBusiness1: true,
        standaloneBusiness2: true,
        dynamicBusiness3: true,
        dynamicBusiness4: true,
      },
    }),
  );

  const standaloneColumnDefs = useMemo(
    () =>
      createStandaloneAdditionalColumnDefs(
        selectedAdditionalBusinesses,
      ),
    [selectedAdditionalBusinesses],
  );

  const dynamicColumnDefs = useMemo(
    () => createDynamicColumnDefs(rowData),
    [rowData],
  );

  const columnDefs = useMemo(
    () => [
      ...FIXED_COLUMN_DEFS,
      ...standaloneColumnDefs,
      ...dynamicColumnDefs,
    ],
    [standaloneColumnDefs, dynamicColumnDefs],
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      suppressHeaderMenuButton: true,
    }),
    [],
  );

  const togglePeriod = (periodType) => {
    setPeriodSelection((previous) => ({
      ...previous,
      [periodType]: !previous[periodType],
    }));
  };

  const toggleAdditionalBusiness = (field) => {
    setSelectedAdditionalBusinesses((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleSearch = () => {
    if (!Object.values(periodSelection).some(Boolean)) {
      alert("조회 기간을 하나 이상 선택하세요.");
      return;
    }

    setRowData(
      createDummyResponseRows({
        periodSelection,
        includeComparison,
        selectedAdditionalBusinesses,
      }),
    );
  };

  return (
    <div
      style={{
        width: "100%",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <h2>동적 다중 헤더 Version 3</h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 10,
          padding: 12,
          border: "1px solid #d9d9d9",
        }}
      >
        <strong>조회 기간</strong>

        {[
          ["M", "월"],
          ["Q", "분기"],
          ["H", "반기"],
          ["Y", "연간"],
        ].map(([type, label]) => (
          <label key={type}>
            <input
              type="checkbox"
              checked={periodSelection[type]}
              onChange={() => togglePeriod(type)}
            />
            {label}
          </label>
        ))}

        <label>
          <input
            type="checkbox"
            checked={includeComparison}
            onChange={(event) =>
              setIncludeComparison(event.target.checked)
            }
          />
          비교 기간 포함
        </label>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 12,
          padding: 12,
          border: "1px solid #d9d9d9",
          backgroundColor: "#f6ffed",
        }}
      >
        <strong>추가 업무 선택</strong>

        {[
          ["standaloneBusiness1", "추가업무1"],
          ["standaloneBusiness2", "추가업무2"],
          ["dynamicBusiness3", "추가업무3"],
          ["dynamicBusiness4", "추가업무4"],
        ].map(([field, label]) => (
          <label key={field}>
            <input
              type="checkbox"
              checked={
                selectedAdditionalBusinesses[field]
              }
              onChange={() =>
                toggleAdditionalBusiness(field)
              }
            />
            {label}
          </label>
        ))}

        <button type="button" onClick={handleSearch}>
          조회
        </button>
      </div>

      <div
        style={{
          marginBottom: 10,
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <div>
          추가업무1: 고정 컬럼 뒤 1depth 컬럼
        </div>
        <div>
          추가업무2: Net Die → 추가업무2의 2depth 컬럼
        </div>
        <div>
          추가업무3·4: 각 리비전 내부에서 기존 업무보다
          먼저 표시
        </div>
        <div>
          리비전 내부 순서: 추가업무3 → 추가업무4 →
          매출 → 매입 → 영업이익 → 재고율
        </div>
      </div>

      <div
        className="ag-theme-balham"
        style={{
          width: 2800,
          height: 620,
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressColumnMoveAnimation
          animateRows={false}
        />
      </div>
    </div>
  );
}
