import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ObjectConvertUtil {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static <T> List<Map<String, Object>> toMapList(List<T> dtoList) {

        return dtoList.stream()
                .map(dto -> mapper.convertValue(
                        dto,
                        new TypeReference<Map<String, Object>>() {}
                ))
                .collect(Collectors.toList());
    }
}



=================

  List<UserDto> dtoList = List.of(
        new UserDto("kim", "김철수"),
        new UserDto("lee", "이영희")
);

List<Map<String, Object>> result =
        ObjectConvertUtil.toMapList(dtoList);

System.out.println(result);
