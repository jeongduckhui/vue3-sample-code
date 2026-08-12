private void setCellValue(
        Cell cell,
        Object value,
        ExcelCellDataType dataType
) {
    if (value == null) {
        cell.setCellValue("");
        return;
    }

    ExcelCellDataType resolvedDataType =
            dataType == null ? ExcelCellDataType.STRING : dataType;

    // 컬럼이 STRING이면 실제 Java 타입과 관계없이 문자열 셀로 저장한다.
    if (resolvedDataType == ExcelCellDataType.STRING) {
        cell.setCellValue(String.valueOf(value));
        return;
    }

    if (value instanceof Integer integerValue) {
        cell.setCellValue(integerValue);
        return;
    }

    if (value instanceof Long longValue) {
        cell.setCellValue(longValue);
        return;
    }

    if (value instanceof Double doubleValue) {
        cell.setCellValue(doubleValue);
        return;
    }

    if (value instanceof BigDecimal bigDecimalValue) {
        cell.setCellValue(bigDecimalValue.doubleValue());
        return;
    }

    if (value instanceof Boolean booleanValue) {
        cell.setCellValue(booleanValue);
        return;
    }

    if (value instanceof LocalDate localDateValue) {
        cell.setCellValue(localDateValue.toString());
        return;
    }

    if (value instanceof LocalDateTime localDateTimeValue) {
        cell.setCellValue(localDateTimeValue.toString());
        return;
    }

    cell.setCellValue(String.valueOf(value));
}
