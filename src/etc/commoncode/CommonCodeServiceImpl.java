@Service
public class CommonCodeServiceImpl implements CommonCodeService {

    private final SqlSession sqlSession;

    public CommonCodeServiceImpl(SqlSession sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Override
    public List<Map<String, Object>> getCommonCodes(Map<String, Object> paramMap) {
        return sqlSession.selectList("commonCodeMapper.selectCommonCodes", paramMap);
    }
}
