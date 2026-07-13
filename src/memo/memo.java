@Service
public class DrmParsedTableService {

    public DrmParsedTable parse(String parsedText) {
        if (parsedText == null || parsedText.isBlank()) {
            return DrmParsedTable.builder()
                    .headers(List.of())
                    .rows(List.of())
                    .build();
        }

        List<List<String>> table = Arrays.stream(parsedText.split("\\R", -1))
                .filter(line -> !line.isBlank())
                .map(line -> Arrays.asList(line.split("\\t", -1)))
                .toList();

        if (table.isEmpty()) {
            return DrmParsedTable.builder()
                    .headers(List.of())
                    .rows(List.of())
                    .build();
        }

        List<String> headers = table.get(0);

        List<List<String>> rows = table.size() > 1
                ? table.subList(1, table.size())
                : List.of();

        return DrmParsedTable.builder()
                .headers(headers)
                .rows(rows)
                .build();
    }
}

@Service
@RequiredArgsConstructor
public class SampleService {

    private final DrmParsingService drmParsingService;
    private final DrmParsedTableService drmParsedTableService;

    public DrmParsedTable uploadExcel(
            MultipartFile file,
            ExcelUploadRequest request,
            String authorization
    ) {
        String jwtToken = authorization.replaceFirst("^Bearer\\s+", "");
        String empNo = "X0257623";

        String parsedText = drmParsingService.parse(
                file,
                jwtToken,
                empNo
        );

        return drmParsedTableService.parse(parsedText);
    }
}




@PostMapping("/excel/upload")
public DrmParsedTable uploadExcel(
        @RequestPart("file") MultipartFile file,
        @RequestPart("request") ExcelUploadRequest request,
        @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization
) {
    return sampleService.uploadExcel(file, request, authorization);
}


@PostMapping("/excel/upload")
public DrmParsedTable uploadExcel(
        @RequestPart("file") MultipartFile file,
        @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization
) {
    return sampleService.uploadExcel(file, authorization);
}






