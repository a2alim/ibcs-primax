package com.ibcs.idsdp.model.domain;

import lombok.Data;

import java.util.List;

@Data
public class UserData {
    EmployeeInfo employee_info;
    List<OfficeInfo> office_info;
    Object user;
}
