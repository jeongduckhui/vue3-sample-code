function parseDynamicColumnField(field) {
  /*
   * 1. 비교기간 컬럼
   *
   * Y2026_sale_B
   * H202601_sale_B
   * Q202601_sale_B
   * M202601_sale_B
   *
   * 기준기간과 형태가 같지만 마지막에 _B가 붙는다.
   * 따라서 기준기간보다 먼저 검사해야 한다.
   */
  const comparisonMatch = field.match(
    /^(Y|H|Q|M)(\d{4})(\d{2})?_(.+)_B$/i,
  );

  if (comparisonMatch) {
    const [
      ,
      periodTypeText,
      year,
      periodNumberText,
      businessCode,
    ] = comparisonMatch;

    const periodType = periodTypeText.toUpperCase();
    const periodNumber = periodNumberText
      ? Number(periodNumberText)
      : null;

    return {
      field,
      revisionType: REVISION_TYPE.COMPARISON,
      periodType,
      year,
      periodNumber,
      businessCode,
      periodHeaderName: createPeriodHeaderName(
        periodType,
        periodNumber,
      ),
    };
  }

  /*
   * 2. 차이 연간 컬럼
   *
   * YYYY_sale
   * YYYY_purchase
   */
  const differenceYearMatch = field.match(
    /^YYYY_(.+)$/i,
  );

  if (differenceYearMatch) {
    const [, businessCode] = differenceYearMatch;

    return {
      field,
      revisionType: REVISION_TYPE.DIFFERENCE,
      periodType: "Y",
      year: "YYYY",
      periodNumber: null,
      businessCode,
      periodHeaderName: null,
    };
  }

  /*
   * 3. 차이 반기/분기/월 컬럼
   *
   * HYYYY01_sale
   * QYYYY01_sale
   * MYYYY01_sale
   */
  const differencePeriodMatch = field.match(
    /^(H|Q|M)YYYY(\d{2})_(.+)$/i,
  );

  if (differencePeriodMatch) {
    const [
      ,
      periodTypeText,
      periodNumberText,
      businessCode,
    ] = differencePeriodMatch;

    const periodType = periodTypeText.toUpperCase();
    const periodNumber = Number(periodNumberText);

    return {
      field,
      revisionType: REVISION_TYPE.DIFFERENCE,
      periodType,
      year: "YYYY",
      periodNumber,
      businessCode,
      periodHeaderName: createPeriodHeaderName(
        periodType,
        periodNumber,
      ),
    };
  }

  /*
   * 4. 기준기간 컬럼
   *
   * Y2026_sale
   * H202601_sale
   * Q202601_sale
   * M202601_sale
   */
  const baseMatch = field.match(
    /^(Y|H|Q|M)(\d{4})(\d{2})?_(.+)$/i,
  );

  if (baseMatch) {
    const [
      ,
      periodTypeText,
      year,
      periodNumberText,
      businessCode,
    ] = baseMatch;

    const periodType = periodTypeText.toUpperCase();
    const periodNumber = periodNumberText
      ? Number(periodNumberText)
      : null;

    return {
      field,
      revisionType: REVISION_TYPE.BASE,
      periodType,
      year,
      periodNumber,
      businessCode,
      periodHeaderName: createPeriodHeaderName(
        periodType,
        periodNumber,
      ),
    };
  }

  /*
   * 고정 컬럼 또는 동적 컬럼 패턴에 해당하지 않는 필드
   */
  return null;
}
