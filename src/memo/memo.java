
package com.example.demo.user.service;

import com.example.demo.user.dto.*;
import com.example.demo.user.entity.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserCommandService {

    private final UserRepository userRepository;

    /**
     * 단건 등록
     */
    @Transactional
    public UserResponseDto create(UserCreateDto dto) {

        User user = User.create(dto.getName(), dto.getEmail());

        User saved = userRepository.save(user);

        return new UserResponseDto(
                saved.getId(),
                saved.getName(),
                saved.getEmail()
        );
    }

    /**
     * 단건 수정 (Dirty Checking)
     */
    @Transactional
    public UserResponseDto update(UserUpdateDto dto) {

        User user = userRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getId()));

        user.update(dto.getName(), dto.getEmail());

        // save 호출 ❌ (Dirty Checking으로 자동 update)

        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    /**
     * 단건 삭제
     */
    @Transactional
    public void delete(UserDeleteDto dto) {

        userRepository.deleteById(dto.getId());
    }
}
