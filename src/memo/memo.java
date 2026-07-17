function parseDynamicColumnField(field) {
  /*
   * 기준기간
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
   * 비교기간 연간
   *
   * YYYY_sale
   * YYYY_sale_profit
   */
  const comparisonYearlyMatch = field.match(
    /^YYYY_(.+)$/i,
  );

  if (comparisonYearlyMatch) {
    const [, businessCode] = comparisonYearlyMatch;

    return {
      field,
      revisionType: REVISION_TYPE.COMPARISON,
      periodType: "Y",

      /*
       * 비교기간 컬럼명에는 실제 연도가 없으므로
       * 화면에서 사용할 연도값은 외부 기준으로 넣어야 한다.
       */
      year: "YYYY",
      periodNumber: null,
      businessCode,
      periodHeaderName: null,
    };
  }

  /*
   * 비교기간 월/분기/반기
   *
   * MYYYY01_sale
   * QYYYY01_sale
   * HYYYY01_sale
   * HYYYY03_sale
   */
  const comparisonPeriodMatch = field.match(
    /^(H|Q|M)YYYY(\d{2})_(.+)$/i,
  );

  if (!comparisonPeriodMatch) {
    return null;
  }

  const [
    ,
    periodTypeText,
    periodNumberText,
    businessCode,
  ] = comparisonPeriodMatch;

  const periodType = periodTypeText.toUpperCase();
  const periodNumber = Number(periodNumberText);

  return {
    field,
    revisionType: REVISION_TYPE.COMPARISON,
    periodType,

    /*
     * YYYY는 컬럼명에 실제로 포함된 문자열이다.
     */
    year: "YYYY",
    periodNumber,
    businessCode,
    periodHeaderName: createPeriodHeaderName(
      periodType,
      periodNumber,
    ),
  };
}
