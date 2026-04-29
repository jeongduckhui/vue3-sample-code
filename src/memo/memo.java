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
