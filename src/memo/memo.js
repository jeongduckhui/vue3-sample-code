function diffData(original, changed) {
  const result = {};

  Object.keys(changed).forEach((key) => {
    const originVal = original?.[key];
    const changedVal = changed[key];

    // 1. 문자열 (콤마 처리)
    if (typeof changedVal === 'string') {
      if (originVal !== changedVal) {
        const originSet = new Set((originVal || '').split(','));
        const changedList = changedVal.split(',');

        const added = changedList.filter(v => !originSet.has(v));
        if (added.length > 0) {
          result[key] = added.join(',');
        }
      }
      return;
    }

    // 2. primitive
    if (
      typeof changedVal !== 'object' ||
      changedVal === null
    ) {
      if (originVal !== changedVal) {
        result[key] = changedVal;
      }
      return;
    }

    // 3. object / array
    const childDiff = diffData(originVal || {}, changedVal);
    if (Object.keys(childDiff).length > 0) {
      result[key] = childDiff;
    }
  });

  return result;
}
--------------------------------------------------------------------
const resultData = diffData(originalData, changedData);
console.log(resultData);
====================================================================
  function toColumnArray(searchCondition) {
  const result = [];

  Object.entries(searchCondition).forEach(([key, value]) => {
    if (typeof value === 'string' && value.includes(',')) {
      value.split(',').forEach(v => {
        result.push({
          COLUMN: key,
          VALUE: v
        });
      });
    } else {
      result.push({
        COLUMN: key,
        VALUE: value
      });
    }
  });

  return result;
}
--------------------------------------------------------------------
toColumnArray(searchCondition);
====================================================================
  function toConditionString(searchCondition) {
  const andConditions = [];

  Object.entries(searchCondition).forEach(([key, value]) => {
    if (typeof value === 'string' && value.includes(',')) {
      const orConditions = value
        .split(',')
        .map(v => `${key}=${v}`)
        .join('||');

      andConditions.push(orConditions);
    } else {
      andConditions.push(`${key}=${value}`);
    }
  });

  return andConditions.join('&&');
}
--------------------------------------------------------------------
toConditionString(searchCondition);
====================================================================

  
