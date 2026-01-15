8@RestController
@RequestMapping("/api/common")
@RequiredArgsConstructor
public class CommonCodeController {

    private final CommonCodeService commonCodeService;

    // public CommonCodeController(CommonCodeService commonCodeService) {
    //     this.commonCodeService = commonCodeService;
    // }

  @GetMapping("/codes")
  public List<Map<String, Object>> getCodes(@RequestParam Map<String, String> params) {
      return commonCodeService.getCommonCodes(params);
  }
}


package com.example.demo.trace;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.*;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.util.*;

@RestControllerAdvice
public class TraceResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(
            MethodParameter returnType,
            Class<? extends HttpMessageConverter<?>> converterType
    ) {
        // 1️⃣ @QueryTraceView 붙은 메서드만
        return returnType.hasMethodAnnotation(QueryTraceView.class);
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response
    ) {

        // 2️⃣ Trace 활성화 안 된 요청은 패스
        if (!TraceContext.isTraceViewEnabled()) {
            return body;
        }

        TransactionTraceInfo tx = TraceContext.getTransaction();
        if (tx == null) {
            return body;
        }

        // 3️⃣ Map 반환인 경우 → trace 자동 삽입
        if (body instanceof Map<?, ?> map) {
            Map<String, Object> wrapped = new LinkedHashMap<>();
            wrapped.putAll((Map<String, Object>) map);
            wrapped.put("_trace", buildTrace(tx));
            return wrapped;
        }

        // 4️⃣ List 반환인 경우 → Map으로 감싸기
        if (body instanceof List<?> list) {
            Map<String, Object> wrapped = new LinkedHashMap<>();
            wrapped.put("data", list);
            wrapped.put("_trace", buildTrace(tx));
            return wrapped;
        }

        // 5️⃣ 그 외 타입은 그대로
        return body;
    }

    private Map<String, Object> buildTrace(TransactionTraceInfo tx) {
        Map<String, Object> trace = new LinkedHashMap<>();
        trace.put("transactionTimeMs", tx.getElapsedMs());
        trace.put("success", tx.isSuccess());
        return trace;
    }
}

@Around(
    "@annotation(org.springframework.transaction.annotation.Transactional) || " +
    "@within(org.springframework.transaction.annotation.Transactional)"
)
public Object measureTx(ProceedingJoinPoint pjp) throws Throwable {
    ...
}
