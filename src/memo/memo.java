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
