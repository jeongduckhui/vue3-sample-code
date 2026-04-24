decorator.datasource.p6spy.enable-logging=true

logging.level.p6spy=info




@Component
public class P6SpySqlCaptureListener {

    @PostConstruct
    public void init() {
        P6SpyOptions.getActiveInstance().setLogMessageFormat(CustomP6SpyFormatter.class.getName());
    }
}





public class CustomP6SpyFormatter implements MessageFormattingStrategy {

    @Override
    public String formatMessage(int connectionId, String now, long elapsed,
                                String category, String prepared, String sql, String url) {

        if (sql != null && !sql.trim().isEmpty()) {
            QueryTraceContext.add(sql); // 👈 핵심 저장
        }

        return sql;
    }
}





