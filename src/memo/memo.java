package com.example.demo.common.paging;

import java.util.List;

public class PagingUtils {

    public static <T> PagingResponse<T> toResponse(PagingDto dto,
                                                   List<T> list,
                                                   long totalCount) {

        int pageNo = dto.getPageNo() < 1 ? 1 : dto.getPageNo();
        int rowPerPage = dto.getRowPerPage() < 1 ? 10 : dto.getRowPerPage();

        int totalPage = (int) Math.ceil((double) totalCount / rowPerPage);

        return PagingResponse.<T>builder()
                .pagingData(list)
                .pageNo(pageNo)
                .rowPerPage(rowPerPage)
                .totalCount(totalCount)
                .totalPage(totalPage)
                .build();
    }
}




public class CommonResponse {

    private String resultMsg;
    private String errorMsg;

    // 일반 조회용
    private Object resultData;

    // 페이징 조회용
    private List<?> pagingData;
    private Long pageNo;
    private Long totalCount;

    // QueryView용
    private Object txInfo;
    private List<String> queryList;

    public static CommonResponse success(Object data) {
        CommonResponse response = new CommonResponse();
        response.setResultMsg("정상");

        if (data instanceof PagingResponse<?> paging) {
            response.setPagingData(paging.getPagingData());
            response.setPageNo(paging.getPageNo());
            response.setTotalCount(paging.getTotalCount());
        } else {
            response.setResultData(data);
        }

        return response;
    }
}
