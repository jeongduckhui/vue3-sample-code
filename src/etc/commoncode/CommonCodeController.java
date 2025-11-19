@RestController
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
