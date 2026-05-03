################################################
[ mybatis ]

package com.example.demo.paging.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Getter
@Setter
public class PageRequestDto {

    private int row_per_page = 10;
    private int page_no = 1;
    private boolean all_view = false;

    public Pageable toPageable() {
        return PageRequest.of(page_no - 1, row_per_page);
    }

    public int getOffset() {
        return (page_no - 1) * row_per_page;
    }
}

package com.example.demo.paging.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PagingSampleRequest extends PageRequestDto {

    private String title;
    private String category;
    private String use_yn;
}

package com.example.demo.paging.mapper;

import com.example.demo.paging.dto.PagingSampleRequest;
import com.example.demo.paging.dto.PagingSampleRow;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PagingSampleMapper {

    List<PagingSampleRow> selectList(PagingSampleRequest request);

    long count(PagingSampleRequest request);
}

<select id="selectList" resultType="PagingSampleRow">
    SELECT
        sample_id,
        title,
        category,
        use_yn,
        created_at
    FROM sample
    WHERE 1=1
    <if test="title != null and title != ''">
        AND title LIKE CONCAT('%', #{title}, '%')
    </if>
    <if test="category != null and category != ''">
        AND category = #{category}
    </if>
    <if test="use_yn != null and use_yn != ''">
        AND use_yn = #{use_yn}
    </if>

    LIMIT #{row_per_page} OFFSET #{offset}
</select>

<select id="count" resultType="long">
    SELECT COUNT(*)
    FROM sample
    WHERE 1=1
    <if test="title != null and title != ''">
        AND title LIKE CONCAT('%', #{title}, '%')
    </if>
    <if test="category != null and category != ''">
        AND category = #{category}
    </if>
    <if test="use_yn != null and use_yn != ''">
        AND use_yn = #{use_yn}
    </if>
</select>

package com.example.demo.paging.repository;

import com.example.demo.paging.dto.PagingSampleRequest;
import com.example.demo.paging.dto.PagingSampleRow;
import com.example.demo.paging.mapper.PagingSampleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PagingSampleRepository {

    private final PagingSampleMapper mapper;

    public Page<PagingSampleRow> search(PagingSampleRequest request) {

        Pageable pageable = request.toPageable();

        List<PagingSampleRow> content = mapper.selectList(request);
        long total = mapper.count(request);

        return new PageImpl<>(content, pageable, total);
    }
}


package com.example.demo.paging.service;

import com.example.demo.paging.dto.*;
import com.example.demo.paging.repository.PagingSampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PagingSampleService {

    private final PagingSampleRepository repository;

    public PagingSampleResponse<PagingSampleRow> getPagingSampleList(PagingSampleRequest request) {

        if (request.isAll_view()) {
            Page<PagingSampleRow> page = repository.search(request);

            return PagingSampleResponse.<PagingSampleRow>builder()
                    .list(page.getContent())
                    .page_no(1)
                    .row_per_page(page.getTotalElements())
                    .tot_page(1)
                    .tot_count(page.getTotalElements())
                    .build();
        }

        Page<PagingSampleRow> page = repository.search(request);

        return PagingSampleResponse.<PagingSampleRow>builder()
                .list(page.getContent())
                .page_no(page.getNumber() + 1)
                .row_per_page(page.getSize())
                .tot_page(page.getTotalPages())
                .tot_count(page.getTotalElements())
                .build();
    }
}


package com.example.demo.paging.controller;

import com.example.demo.paging.dto.PagingSampleRequest;
import com.example.demo.paging.dto.PagingSampleResponse;
import com.example.demo.paging.dto.PagingSampleRow;
import com.example.demo.paging.service.PagingSampleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/paging-samples")
public class PagingSampleController {

    private final PagingSampleService service;

    @GetMapping
    public PagingSampleResponse<PagingSampleRow> getPagingSamples(PagingSampleRequest request) {
        return service.getPagingSampleList(request);
    }
}



################################################
[ querydsl ]

package com.example.demo.paging.repository;

import com.example.demo.paging.dto.PagingSampleRequest;
import com.example.demo.paging.dto.PagingSampleRow;
import org.springframework.data.domain.Page;

public interface PagingSampleQueryRepository {

    Page<PagingSampleRow> search(PagingSampleRequest request);
}



package com.example.demo.paging.repository;

import com.example.demo.paging.dto.*;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PagingSampleQueryRepositoryImpl implements PagingSampleQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<PagingSampleRow> search(PagingSampleRequest request) {

        QSample sample = QSample.sample;
        Pageable pageable = request.toPageable();

        List<PagingSampleRow> content = queryFactory
                .select(new QPagingSampleRow(
                        sample.id,
                        sample.title,
                        sample.category,
                        sample.useYn,
                        sample.createdAt
                ))
                .from(sample)
                .where(
                        titleContains(sample, request),
                        categoryEq(sample, request),
                        useYnEq(sample, request)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(sample.count())
                .from(sample)
                .where(
                        titleContains(sample, request),
                        categoryEq(sample, request),
                        useYnEq(sample, request)
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total);
    }

    private BooleanExpression titleContains(QSample sample, PagingSampleRequest request) {
        return request.getTitle() != null ? sample.title.contains(request.getTitle()) : null;
    }

    private BooleanExpression categoryEq(QSample sample, PagingSampleRequest request) {
        return request.getCategory() != null ? sample.category.eq(request.getCategory()) : null;
    }

    private BooleanExpression useYnEq(QSample sample, PagingSampleRequest request) {
        return request.getUse_yn() != null ? sample.useYn.eq(request.getUse_yn()) : null;
    }
}


package com.example.demo.paging.service;

import com.example.demo.paging.dto.*;
import com.example.demo.paging.repository.PagingSampleQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PagingSampleService {

    private final PagingSampleQueryRepository repository;

    public PagingSampleResponse<PagingSampleRow> getPagingSampleList(PagingSampleRequest request) {

        Page<PagingSampleRow> page = repository.search(request);

        return PagingSampleResponse.<PagingSampleRow>builder()
                .list(page.getContent())
                .page_no(page.getNumber() + 1)
                .row_per_page(page.getSize())
                .tot_page(page.getTotalPages())
                .tot_count(page.getTotalElements())
                .build();
    }
}


@RestController
@RequiredArgsConstructor
@RequestMapping("/paging-samples")
public class PagingSampleController {

    private final PagingSampleService service;

    @GetMapping
    public PagingSampleResponse<PagingSampleRow> getPagingSamples(PagingSampleRequest request) {
        return service.getPagingSampleList(request);
    }
}






@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

[ persistable 적용 저장 ]


package com.example.demo.user.domain;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.domain.Persistable;

@Entity
@Getter
@Table(name = "users")
public class User implements Persistable<String> {

    @Id
    private String userId;

    private String name;

    @Transient
    private boolean isNew = true;

    protected User() {}

    public User(String userId, String name, boolean isNew) {
        this.userId = userId;
        this.name = name;
        this.isNew = isNew;
    }

    public void update(String name) {
        this.name = name;
    }

    @Override
    public String getId() {
        return userId;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostLoad
    @PostPersist
    public void markNotNew() {
        this.isNew = false;
    }
}



package com.example.demo.user.dto;

import lombok.Getter;

@Getter
public class UserSaveRowDto {

    private String userId;
    private String name;
    private String rowType; 
    // INSERT / UPDATE / DELETE
}


[ 일반 레포지토리 ]
package com.example.demo.user.repository;

import com.example.demo.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}


[ bulk용 레포지토리 ]
package com.example.demo.user.repository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserBulkRepository {

    private final EntityManager em;

    public void bulkUpdate(String userId, String name) {

        em.createQuery("""
            update User u
            set u.name = :name
            where u.userId = :userId
        """)
        .setParameter("name", name)
        .setParameter("userId", userId)
        .executeUpdate();
    }

    public void bulkDelete(String userId) {

        em.createQuery("""
            delete from User u
            where u.userId = :userId
        """)
        .setParameter("userId", userId)
        .executeUpdate();
    }
}


[ 일반 서비스 ]
package com.example.demo.user.service;

import com.example.demo.user.domain.User;
import com.example.demo.user.dto.UserSaveRowDto;
import com.example.demo.user.repository.UserBulkRepository;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserBulkRepository bulkRepository;
    private final EntityManager em;

    @Transactional
    public void saveAll(List<UserSaveRowDto> rows) {

        List<User> insertList = new ArrayList<>();
        List<UserSaveRowDto> updateList = new ArrayList<>();
        List<String> deleteList = new ArrayList<>();

        // 분류
        for (UserSaveRowDto row : rows) {

            switch (row.getRowType()) {

                case "INSERT" -> insertList.add(
                        new User(row.getUserId(), row.getName(), true)
                );

                case "UPDATE" -> updateList.add(row);

                case "DELETE" -> deleteList.add(row.getUserId());
            }
        }

        // INSERT (Persistable 활용)
        if (!insertList.isEmpty()) {
            userRepository.saveAll(insertList);
        }

        // UPDATE (Dirty Checking 방식)
        for (UserSaveRowDto row : updateList) {

            User user = userRepository.findById(row.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자"));

            user.update(row.getName());
        }

        // DELETE (일괄 삭제)
        if (!deleteList.isEmpty()) {
            userRepository.deleteAllByIdInBatch(deleteList);
        }
    }
}



[ bulk용 서비스 ]
package com.example.demo.user.service;

import com.example.demo.user.domain.User;
import com.example.demo.user.dto.UserSaveRowDto;
import com.example.demo.user.repository.UserBulkRepository;
import com.example.demo.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserBulkService {

    private final UserRepository userRepository;
    private final UserBulkRepository bulkRepository;
    private final EntityManager em;

    @Transactional
    public void saveAll(List<UserSaveRowDto> rows) {

        List<User> insertList = new ArrayList<>();

        for (UserSaveRowDto row : rows) {

            switch (row.getRowType()) {

                case "INSERT" -> insertList.add(
                        new User(row.getUserId(), row.getName(), true)
                );

                case "UPDATE" -> bulkRepository.bulkUpdate(
                        row.getUserId(), row.getName()
                );

                case "DELETE" -> bulkRepository.bulkDelete(
                        row.getUserId()
                );
            }
        }

        // INSERT 처리
        if (!insertList.isEmpty()) {
            userRepository.saveAll(insertList);
        }

        // 필수 (영속성 컨텍스트 초기화)
        em.flush();
        em.clear();
    }
}


package com.example.demo.user.controller;

import com.example.demo.user.dto.UserSaveRowDto;
import com.example.demo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/save")
    public void save(@RequestBody List<UserSaveRowDto> rows) {
        userService.saveAll(rows);
    }
}











