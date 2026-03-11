import { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import api from "../api/api";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function UserGrid(){

  const gridRef = useRef();

  const [rowData,setRowData] = useState([]);

  const deletedRows = useRef([]);

  const columnDefs = [

    { field:"id" },

    { field:"username", editable:true },

    { field:"email", editable:true },

    { field:"phone", editable:true },

    { field:"department", editable:true },

    { field:"position", editable:true },

    { field:"salary", editable:true },

    { field:"status", editable:true }

  ];


  const addRow = () => {

    const newRow = {

      id: Date.now(),
      username:"",
      email:"",
      phone:"",
      department:"",
      position:"",
      salary:0,
      status:"ACTIVE",

      _status:"insert"

    };

    gridRef.current.api.applyTransaction({
      add:[newRow]
    });

  };


  const deleteRow = () => {

    const selected = gridRef.current.api.getSelectedRows();

    selected.forEach(row => {

      if(row._status !== "insert"){
        deletedRows.current.push(row);
      }

    });

    gridRef.current.api.applyTransaction({
      remove:selected
    });

  };


  const onCellValueChanged = (params) => {

    if(params.data._status !== "insert"){
      params.data._status = "update";
    }

  };


  const save = async () => {

    const insertRows = [];
    const updateRows = [];

    gridRef.current.api.forEachNode(node => {

      const row = node.data;

      if(row._status === "insert")
        insertRows.push(row);

      if(row._status === "update")
        updateRows.push(row);

    });

    const payload = {

      insertRows,
      updateRows,
      deleteRows: deletedRows.current

    };

    await api.post("/api/users/batch", payload);

    alert("저장 완료");

  };


  return(

    <div>

      <button onClick={addRow}>행 추가</button>

      <button onClick={deleteRow}>행 삭제</button>

      <button onClick={save}>저장</button>

      <div
        className="ag-theme-alpine"
        style={{height:500}}
      >

        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          onCellValueChanged={onCellValueChanged}
        />

      </div>

    </div>

  );

}
export default UserGrid;

package com.example.demo.user.dto;

import lombok.Data;

@Data
public class UserDto {

    private Long id;

    private String username;
    private String email;
    private String phone;

    private String department;
    private String position;

    private Integer salary;
    private String status;

}


package com.example.demo.user.dto;

import lombok.Data;
import java.util.List;

@Data
public class GridSaveRequest {

    private List<UserDto> rows;

}

package com.example.demo.user.mapper;

import com.example.demo.user.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {

    void mergeBatch(List<UserDto> list);

    void deleteBatch(List<Long> ids);

}

<mapper namespace="com.example.demo.user.mapper.UserMapper">

    <insert id="mergeBatch">

        MERGE INTO user_account t
        USING
        (
            <foreach collection="list"
                     item="u"
                     separator="UNION ALL">

                SELECT
                    #{u.id} AS id,
                    #{u.username} AS username,
                    #{u.email} AS email,
                    #{u.phone} AS phone,
                    #{u.department} AS department,
                    #{u.position} AS position,
                    #{u.salary} AS salary,
                    #{u.status} AS status
                FROM dual

            </foreach>

        ) s

        ON (t.id = s.id)

        WHEN MATCHED THEN
        UPDATE SET
            t.username = s.username,
            t.email = s.email,
            t.phone = s.phone,
            t.department = s.department,
            t.position = s.position,
            t.salary = s.salary,
            t.status = s.status

        WHEN NOT MATCHED THEN
        INSERT
        (
            id,
            username,
            email,
            phone,
            department,
            position,
            salary,
            status
        )
        VALUES
        (
            s.id,
            s.username,
            s.email,
            s.phone,
            s.department,
            s.position,
            s.salary,
            s.status
        )

    </insert>


    <delete id="deleteBatch">

        DELETE FROM user_account
        WHERE id IN

        <foreach collection="list"
                 item="id"
                 open="("
                 separator=","
                 close=")">
            #{id}
        </foreach>

    </delete>

</mapper>

package com.example.demo.user.service;

import com.example.demo.user.dto.GridSaveRequest;
import com.example.demo.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    @Transactional
    public void batchSave(GridSaveRequest req){

        if(req.getRows()!=null && !req.getRows().isEmpty())
            userMapper.mergeBatch(req.getRows());

    }

}

package com.example.demo.user.controller;

import com.example.demo.user.dto.GridSaveRequest;
import com.example.demo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/merge")
    public void merge(@RequestBody GridSaveRequest request){

        userService.batchSave(request);

    }

}


================================================================

  <mapper namespace="com.example.demo.user.mapper.UserMapper">

    <!-- INSERT -->

    <insert id="insertBatch">

        INSERT INTO user_account
        (
            id,
            username,
            email,
            phone,
            department,
            position,
            salary,
            status
        )
        VALUES

        <foreach collection="list" item="u" separator=",">
            (
                #{u.id},
                #{u.username},
                #{u.email},
                #{u.phone},
                #{u.department},
                #{u.position},
                #{u.salary},
                #{u.status}
            )
        </foreach>

    </insert>


    <!-- UPDATE -->

    <update id="updateBatch">

        <foreach collection="list" item="u" separator=";">

            UPDATE user_account

            <set>

                <if test="u.username != null">
                    username = #{u.username},
                </if>

                <if test="u.email != null">
                    email = #{u.email},
                </if>

                <if test="u.phone != null">
                    phone = #{u.phone},
                </if>

                <if test="u.department != null">
                    department = #{u.department},
                </if>

                <if test="u.position != null">
                    position = #{u.position},
                </if>

                <if test="u.salary != null">
                    salary = #{u.salary},
                </if>

                <if test="u.status != null">
                    status = #{u.status},
                </if>

            </set>

            WHERE id = #{u.id}

        </foreach>

    </update>


    <!-- DELETE -->

    <delete id="deleteBatch">

        DELETE FROM user_account
        WHERE id IN

        <foreach collection="list"
                 item="u"
                 open="("
                 separator=","
                 close=")">
            #{u.id}
        </foreach>

    </delete>

</mapper>
