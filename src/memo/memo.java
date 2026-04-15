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
