public class WeeklyStatsResponse {

    private String userId;

    // key: week (예: 2024W01)
    // value: 값 (예: 매출, 건수 등)
    private Map<String, Integer> weekData = new LinkedHashMap<>();

}


==========================


{
  "userId": "A001",
  "weekData": {
    "2024W01": 10,
    "2024W02": 15,
    "2024W03": 8
  }
}


Map<String, Integer> map = result.stream()
    .collect(Collectors.toMap(
        r -> r.getWeek(),
        r -> r.getValue(),
        (a, b) -> b,
        LinkedHashMap::new
    ));
===================================================================================================

    @Getter
@AllArgsConstructor
public class StatsResponse {

    private String userId;
    private String region;
    private String userName;

    private Map<String, Integer> weekData;
}


public List<StatsResponse> getStats() {

    List<Map<String, Object>> rows = repository.findAll();

    List<StatsResponse> result = new ArrayList<>();

    for (Map<String, Object> row : rows) {

        // 1. 고정 컬럼 추출
        String userId = (String) row.get("userId");
        String region = (String) row.get("region");
        String userName = (String) row.get("userName");

        // 2. 동적 컬럼 (주차) 추출
        Map<String, Integer> weekMap = new LinkedHashMap<>();

        for (Map.Entry<String, Object> entry : row.entrySet()) {

            String key = entry.getKey();

            // 고정 컬럼 제외
            if ("userId".equals(key) || "region".equals(key) || "userName".equals(key)) {
                continue;
            }

            // 주차 컬럼만 필터링 (패턴 기준)
            if (key.endsWith("W")) {
                Integer value = entry.getValue() != null
                    ? ((Number) entry.getValue()).intValue()
                    : 0;

                weekMap.put(key, value);
            }
        }

        result.add(new StatsResponse(userId, region, userName, weekMap));
    }

    return result;
}


#####################################################################################



package com.example.demo.util;

import java.util.*;
import java.util.function.Predicate;

public class WeekDataExtractor {

    private WeekDataExtractor() {
        // 유틸 클래스라서 생성자 막음
    }

    /**
     * row(Map)에서 동적 주차 컬럼을 추출하여 Map으로 반환
     *
     * @param row            DB 조회 결과 row
     * @param excludeColumns 제외할 고정 컬럼
     * @param keyFilter      주차 컬럼 필터 조건 (예: yyyyMMddW)
     * @return 주차 Map (순서 유지)
     */
    public static Map<String, Integer> extract(
            Map<String, Object> row,
            Set<String> excludeColumns,
            Predicate<String> keyFilter
    ) {

        Map<String, Integer> result = new LinkedHashMap<>();

        for (Map.Entry<String, Object> entry : row.entrySet()) {

            String key = entry.getKey();

            // 1. 제외 컬럼 skip
            if (excludeColumns.contains(key)) {
                continue;
            }

            // 2. 필터 조건 (주차 컬럼)
            if (!keyFilter.test(key)) {
                continue;
            }

            // 3. 값 변환 (null 방어)
            Object rawValue = entry.getValue();

            Integer value = (rawValue != null)
                    ? ((Number) rawValue).intValue()
                    : 0;

            result.put(key, value);
        }

        return result;
    }
}


-----------------------------------


    public List<StatsResponse> getStats() {

    List<Map<String, Object>> rows = repository.findAll();

    List<StatsResponse> result = new ArrayList<>();

    for (Map<String, Object> row : rows) {

        // 1. 고정 컬럼
        String userId = (String) row.get("userId");
        String region = (String) row.get("region");
        String userName = (String) row.get("userName");

        // 2. 주차 데이터 추출 
        Map<String, Integer> weekMap =
                WeekDataExtractor.extract(
                        row,
                        Set.of("userId", "region", "userName"),
                        key -> key.matches("\\d{8}W") // 20250101W 형태
                );

        // 3. DTO 세팅
        result.add(new StatsResponse(userId, region, userName, weekMap));
    }

    return result;
}


------------------------

    Map<String, Integer> weekMap =
    WeekDataExtractor.extract(
        row,
        Set.of("empId", "deptName", "jobGrade"),
        key -> key.endsWith("W")
    );
