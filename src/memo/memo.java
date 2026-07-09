@Service
public class ExcelDrmParsedTextService {

    public ExcelUploadPreviewResult parseToPreviewResult(
            String parsedText,
            List<ExcelColumnMeta> columns
    ) {
        List<List<String>> table = parseTsv(parsedText);

        if (table.isEmpty()) {
            return ExcelUploadPreviewResult.empty(columns);
        }

        List<String> excelHeaders = table.get(0);

        Map<Integer, ExcelColumnMeta> columnIndexMetaMap =
                matchHeaders(excelHeaders, columns);

        List<Map<String, Object>> rows =
                bindRows(table, columnIndexMetaMap);

        List<ExcelValidationError> errors =
                validateHeader(excelHeaders, columns);

        return ExcelUploadPreviewResult.builder()
                .columns(columns)
                .rows(rows)
                .errors(errors)
                .totalCount(rows.size())
                .validCount(rows.size() - errors.size())
                .errorCount(errors.size())
                .build();
    }

    private List<List<String>> parseTsv(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        return Arrays.stream(text.split("\\R", -1))
                .filter(line -> !line.isBlank())
                .map(line -> Arrays.asList(line.split("\\t", -1)))
                .toList();
    }

    private Map<Integer, ExcelColumnMeta> matchHeaders(
            List<String> excelHeaders,
            List<ExcelColumnMeta> columns
    ) {
        Map<String, ExcelColumnMeta> metaMap = columns.stream()
                .filter(column -> !column.isHidden())
                .collect(Collectors.toMap(
                        column -> normalizeHeader(column.getHeaderName()),
                        Function.identity(),
                        (first, second) -> first
                ));

        Map<Integer, ExcelColumnMeta> result = new LinkedHashMap<>();

        for (int i = 0; i < excelHeaders.size(); i++) {
            String excelHeader = normalizeHeader(excelHeaders.get(i));
            ExcelColumnMeta meta = metaMap.get(excelHeader);

            if (meta != null) {
                result.put(i, meta);
            }
        }

        return result;
    }

    private List<Map<String, Object>> bindRows(
            List<List<String>> table,
            Map<Integer, ExcelColumnMeta> columnIndexMetaMap
    ) {
        List<Map<String, Object>> rows = new ArrayList<>();

        for (int rowIndex = 1; rowIndex < table.size(); rowIndex++) {
            List<String> cells = table.get(rowIndex);

            Map<String, Object> row = new LinkedHashMap<>();

            for (Map.Entry<Integer, ExcelColumnMeta> entry : columnIndexMetaMap.entrySet()) {
                int cellIndex = entry.getKey();
                ExcelColumnMeta meta = entry.getValue();

                String value = cellIndex < cells.size() ? cells.get(cellIndex) : "";

                row.put(meta.getField(), value);
            }

            row.put("_rowStatus", "NORMAL");
            row.put("_rowIndex", rowIndex + 1);

            rows.add(row);
        }

        return rows;
    }

    private List<ExcelValidationError> validateHeader(
            List<String> excelHeaders,
            List<ExcelColumnMeta> columns
    ) {
        Set<String> uploadedHeaders = excelHeaders.stream()
                .map(this::normalizeHeader)
                .collect(Collectors.toSet());

        List<ExcelValidationError> errors = new ArrayList<>();

        for (ExcelColumnMeta column : columns) {
            if (column.isRequired()
                    && !uploadedHeaders.contains(normalizeHeader(column.getHeaderName()))) {

                errors.add(ExcelValidationError.builder()
                        .rowIndex(0)
                        .field(column.getField())
                        .headerName(column.getHeaderName())
                        .message("필수 컬럼이 누락되었습니다.")
                        .build());
            }
        }

        return errors;
    }

    private String normalizeHeader(String value) {
        if (value == null) {
            return "";
        }

        return value
                .replace("\uFEFF", "")
                .replaceAll("\\s+", "")
                .trim();
    }
}
