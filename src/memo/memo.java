package com.example.demo.domain.user.mapper;

import com.example.demo.domain.user.dto.UserRowDto;
import com.example.demo.domain.user.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Entity → DTO
     */
    UserRowDto toDto(User user);

    /**
     * update용 (Dirty Checking)
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromDto(UserRowDto dto, @MappingTarget User user);

    /**
     * create용 (Entity 생성 로직 보호)
     */
    default User toEntity(UserRowDto dto) {
        return User.create(dto.getName(), dto.getEmail());
    }
}





package com.example.demo.domain.user.service;

import com.example.demo.domain.user.dto.*;
import com.example.demo.domain.user.entity.User;
import com.example.demo.domain.user.mapper.UserMapper;
import com.example.demo.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCommandService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // =====================================================
    // 1. 단건 등록
    // =====================================================
    @Transactional
    public UserResponse create(UserCreateRequest req) {

        User user = User.create(req.getName(), req.getEmail());

        userRepository.save(user);

        return new UserResponse(user.getId());
    }

    // =====================================================
    // 2. 단건 수정
    // =====================================================
    @Transactional
    public UserResponse update(UserUpdateRequest req) {

        User user = userRepository.findById(req.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.update(req.getName(), req.getEmail());

        return new UserResponse(user.getId());
    }

    // =====================================================
    // 3. 단건 삭제
    // =====================================================
    @Transactional
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    // =====================================================
    // 4. 다건 저장 (AG Grid)
    // =====================================================
    @Transactional
    public UserSaveResponse save(UserSaveRequest req) {

        int deleteCnt = deleteAll(req.getDeleted());
        int updateCnt = updateAll(req.getUpdated());
        int insertCnt = insertAll(req.getAdded());

        return new UserSaveResponse(insertCnt, updateCnt, deleteCnt);
    }

    // =========================
    // 내부 로직
    // =========================

    private int insertAll(List<UserRowDto> list) {
        if (list == null || list.isEmpty()) return 0;

        List<User> entities = list.stream()
                .map(userMapper::toEntity) // create 사용
                .toList();

        userRepository.saveAll(entities);

        return entities.size();
    }

    private int updateAll(List<UserRowDto> list) {
        if (list == null || list.isEmpty()) return 0;

        List<Long> ids = list.stream()
                .map(UserRowDto::getId)
                .toList();

        Map<Long, User> map = userRepository.findAllById(ids)
                .stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        for (UserRowDto dto : list) {
            User user = map.get(dto.getId());
            if (user == null) {
                throw new RuntimeException("User not found: " + dto.getId());
            }

            userMapper.updateFromDto(dto, user); // Dirty Checking
        }

        return list.size();
    }

    private int deleteAll(List<UserRowDto> list) {
        if (list == null || list.isEmpty()) return 0;

        List<Long> ids = list.stream()
                .map(UserRowDto::getId)
                .toList();

        userRepository.deleteAllById(ids);

        return ids.size();
    }
}





