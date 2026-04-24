com.example.demo
 └─ monitoring
    └─ querytrace
       ├─ annotation
       │  └─ QueryTrace.java
       ├─ aop
       │  └─ QueryTraceAspect.java
       ├─ config
       │  └─ QueryTraceJpaConfig.java
       ├─ context
       │  └─ QueryTraceContext.java
       ├─ dto
       │  ├─ QueryTraceLogDto.java
       │  ├─ QueryTraceResponseDto.java
       │  └─ QueryTraceSqlDto.java
       ├─ hibernate
       │  └─ QueryTraceStatementInspector.java
       ├─ service
       │  └─ QueryTraceStore.java
       └─ web
          └─ QueryTraceController.java



package com.example.demo.monitoring.querytrace.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface QueryTrace {

    String value() default "";

    boolean enabled() default true;
}



package com.example.demo.monitoring.querytrace.context;

import com.example.demo.monitoring.querytrace.dto.QueryTraceLogDto;
import com.example.demo.monitoring.querytrace.dto.QueryTraceSqlDto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public final class QueryTraceContext {

    private static final ThreadLocal<QueryTraceLogDto> HOLDER = new ThreadLocal<>();

    private QueryTraceContext() {
    }

    public static void start(String traceId, String traceName, Object[] methodArgs) {
        QueryTraceLogDto log = QueryTraceLogDto.builder()
                .traceId(traceId)
                .traceName(traceName)
                .startedAt(LocalDateTime.now())
                .methodArgs(methodArgs)
                .sqlList(new ArrayList<>())
                .build();

        HOLDER.set(log);
    }

    public static boolean isActive() {
        return HOLDER.get() != null;
    }

    public static void addSql(String sql) {
        QueryTraceLogDto log = HOLDER.get();

        if (log == null) {
            return;
        }

        List<QueryTraceSqlDto> sqlList = log.getSqlList();

        sqlList.add(QueryTraceSqlDto.builder()
                .seq(sqlList.size() + 1)
                .sql(sql)
                .capturedAt(LocalDateTime.now())
                .build());
    }

    public static QueryTraceLogDto getLog() {
        return HOLDER.get();
    }

    public static void clear() {
        HOLDER.remove();
    }
}





package com.example.demo.monitoring.querytrace.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryTraceLogDto {

    private String traceId;

    private String traceName;

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private Object[] methodArgs;

    private List<QueryTraceSqlDto> sqlList;
}







package com.example.demo.monitoring.querytrace.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryTraceSqlDto {

    private int seq;

    private String sql;

    private LocalDateTime capturedAt;
}






package com.example.demo.monitoring.querytrace.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryTraceResponseDto {

    private String traceId;

    private String traceName;

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private Object[] requestParams;

    private List<QueryTraceSqlDto> sqlList;
}







package com.example.demo.monitoring.querytrace.service;

import com.example.demo.monitoring.querytrace.dto.QueryTraceLogDto;
import com.example.demo.monitoring.querytrace.dto.QueryTraceResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class QueryTraceStore {

    private final Map<String, QueryTraceResponseDto> store = new ConcurrentHashMap<>();

    public void save(QueryTraceLogDto logDto) {
        if (logDto == null || logDto.getTraceId() == null) {
            return;
        }

        QueryTraceResponseDto response = QueryTraceResponseDto.builder()
                .traceId(logDto.getTraceId())
                .traceName(logDto.getTraceName())
                .startedAt(logDto.getStartedAt())
                .endedAt(LocalDateTime.now())
                .requestParams(logDto.getMethodArgs())
                .sqlList(logDto.getSqlList())
                .build();

        store.put(logDto.getTraceId(), response);

        log.debug("QueryTrace saved. traceId={}, sqlCount={}",
                logDto.getTraceId(),
                logDto.getSqlList() == null ? 0 : logDto.getSqlList().size());
    }

    public QueryTraceResponseDto get(String traceId) {
        return store.get(traceId);
    }

    public void remove(String traceId) {
        store.remove(traceId);
    }
}







package com.example.demo.monitoring.querytrace.aop;

import com.example.demo.monitoring.querytrace.annotation.QueryTrace;
import com.example.demo.monitoring.querytrace.context.QueryTraceContext;
import com.example.demo.monitoring.querytrace.dto.QueryTraceLogDto;
import com.example.demo.monitoring.querytrace.service.QueryTraceStore;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
public class QueryTraceAspect {

    private final QueryTraceStore queryTraceStore;

    @Around("@annotation(queryTrace)")
    public Object trace(ProceedingJoinPoint joinPoint, QueryTrace queryTrace) throws Throwable {

        if (!queryTrace.enabled()) {
            return joinPoint.proceed();
        }

        String traceId = UUID.randomUUID().toString();
        String traceName = resolveTraceName(joinPoint, queryTrace);

        try {
            QueryTraceContext.start(traceId, traceName, joinPoint.getArgs());

            Object result = joinPoint.proceed();

            QueryTraceLogDto log = QueryTraceContext.getLog();
            queryTraceStore.save(log);

            return result;

        } finally {
            QueryTraceContext.clear();
        }
    }

    private String resolveTraceName(ProceedingJoinPoint joinPoint, QueryTrace queryTrace) {
        if (queryTrace.value() != null && !queryTrace.value().isBlank()) {
            return queryTrace.value();
        }

        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        return className + "." + methodName;
    }
}







package com.example.demo.monitoring.querytrace.hibernate;

import com.example.demo.monitoring.querytrace.context.QueryTraceContext;
import org.hibernate.resource.jdbc.spi.StatementInspector;

public class QueryTraceStatementInspector implements StatementInspector {

    @Override
    public String inspect(String sql) {
        if (QueryTraceContext.isActive() && isTraceTarget(sql)) {
            QueryTraceContext.addSql(sql);
        }

        return sql;
    }

    private boolean isTraceTarget(String sql) {
        if (sql == null || sql.isBlank()) {
            return false;
        }

        String normalizedSql = sql.trim().toLowerCase();

        return normalizedSql.startsWith("select");
    }
}







package com.example.demo.monitoring.querytrace.config;

import com.example.demo.monitoring.querytrace.hibernate.QueryTraceStatementInspector;
import org.hibernate.cfg.AvailableSettings;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueryTraceJpaConfig {

    @Bean
    public HibernatePropertiesCustomizer queryTraceHibernatePropertiesCustomizer() {
        return hibernateProperties -> hibernateProperties.put(
                AvailableSettings.STATEMENT_INSPECTOR,
                new QueryTraceStatementInspector()
        );
    }
}








package com.example.demo.monitoring.querytrace.web;

import com.example.demo.monitoring.querytrace.dto.QueryTraceResponseDto;
import com.example.demo.monitoring.querytrace.service.QueryTraceStore;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/monitoring/query-trace")
public class QueryTraceController {

    private final QueryTraceStore queryTraceStore;

    @GetMapping("/{traceId}")
    public QueryTraceResponseDto getQueryTrace(@PathVariable String traceId) {
        return queryTraceStore.get(traceId);
    }

    @DeleteMapping("/{traceId}")
    public void removeQueryTrace(@PathVariable String traceId) {
        queryTraceStore.remove(traceId);
    }
}







--------------------------------


  package com.example.demo.sample.service;

import com.example.demo.monitoring.querytrace.annotation.QueryTrace;
import com.example.demo.sample.dto.SampleSearchRequest;
import com.example.demo.sample.dto.SampleSearchResponse;
import com.example.demo.sample.repository.SampleJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SampleService {

    private final SampleJpaRepository sampleJpaRepository;

    @QueryTrace("샘플 조회 쿼리 추적")
    public List<SampleSearchResponse> search(SampleSearchRequest request) {
        return sampleJpaRepository.search(request);
    }
}






package com.example.demo.sample.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SampleSearchRequest {

    private String progId;

    private String progNm;

    private String sysTypCd;

    private String useYn;
}







{
  "traceId": "8f2d0e4e-ec2b-49d7-a0e0-6a3a2c13b1d1",
  "traceName": "샘플 조회 쿼리 추적",
  "requestParams": [
    {
      "progId": "ADM001",
      "progNm": "사용자",
      "sysTypCd": "ADM",
      "useYn": "Y"
    }
  ],
  "sqlList": [
    {
      "seq": 1,
      "sql": "select ... from mad_prog_list p1_0 where p1_0.prog_id=?",
      "capturedAt": "2026-04-24T09:30:00"
    }
  ]
}







