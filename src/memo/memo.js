@Service
@RequiredArgsConstructor
@Transactional
public class UserRoleService {

    private final UserRoleRepository repository;

    public void update(UserRoleUpdateRequest request) {

        // 1. 복합키 생성
        UserRoleId id = new UserRoleId(
                request.getUserId(),
                request.getRoleId()
        );

        // 2. 조회
        UserRole entity = repository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("데이터 없음"));

        // 3. 값 변경 (Dirty Checking)
        entity.setRoleName(request.getRoleName());
        entity.setUseYn(request.getUseYn());

        // save() 호출 안해도 됨
    }
}
