package com.example.demo.user.repository;

import com.example.demo.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}



package com.example.demo.user.service;

import com.example.demo.user.dto.*;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EntityManager entityManager;

    @Transactional
    public UserSaveResponseDto save(UserSaveRequestDto req) {

        int deleteCnt = delete(req.getDeleted());
        int updateCnt = update(req.getUpdated());
        int insertCnt = insert(req.getAdded());

        return new UserSaveResponseDto(insertCnt, updateCnt, deleteCnt);
    }

    /**
     * 삭제
     */
    private int delete(List<UserDeleteDto> list) {
        if (list == null || list.isEmpty()) return 0;

        List<Long> ids = list.stream()
                .map(UserDeleteDto::getId)
                .toList();

        userRepository.deleteAllById(ids);
        return ids.size();
    }

    /**
     * 수정 (Dirty Checking)
     */
    private int update(List<UserUpdateDto> list) {
        if (list == null || list.isEmpty()) return 0;

        // 🔥 성능 최적화: 한번에 조회
        List<Long> ids = list.stream()
                .map(UserUpdateDto::getId)
                .toList();

        Map<Long, User> userMap =
                userRepository.findAllById(ids).stream()
                        .collect(Collectors.toMap(User::getId, u -> u));

        for (UserUpdateDto dto : list) {
            User user = userMap.get(dto.getId());
            if (user == null) {
                throw new RuntimeException("User not found: " + dto.getId());
            }
            user.update(dto.getName(), dto.getEmail());
        }

        return list.size();
    }

    /**
     * 등록
     */
    private int insert(List<UserCreateDto> list) {
        if (list == null || list.isEmpty()) return 0;

        List<User> entities = list.stream()
                .map(dto -> User.create(dto.getName(), dto.getEmail()))
                .toList();

        userRepository.saveAll(entities);

        return entities.size();
    }
}





package com.example.demo.user.controller;

import com.example.demo.user.dto.UserSaveRequestDto;
import com.example.demo.user.dto.UserSaveResponseDto;
import com.example.demo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    /**
     * AG Grid 다건 저장
     */
    @PostMapping("/save")
    public UserSaveResponseDto save(@RequestBody UserSaveRequestDto request) {
        return userService.save(request);
    }
}





spring.jpa.properties.hibernate.jdbc.batch_size=1000
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=tru






    0

