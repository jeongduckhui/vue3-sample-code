@Service
public class CommonCodeServiceImpl implements CommonCodeService {

    private final SqlSession sqlSession;

    public CommonCodeServiceImpl(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Override
    @Cacheable(value = "commonCodes", key = "#paramMap['codeGroupNumber'] + '-' + #paramMap['useYn']")
    public List<Map<String, Object>> getCommonCodes(Map<String, Object> paramMap) {
        System.out.println("DB 조회 발생: " + paramMap);
        return sqlSession.selectList("commonCodeMapper.selectCommonCodes", paramMap);
    }
}
