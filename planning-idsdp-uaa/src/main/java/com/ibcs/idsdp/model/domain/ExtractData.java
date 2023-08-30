package com.ibcs.idsdp.model.domain;

import lombok.Data;

import java.util.List;

@Data
public class ExtractData {
    EmployeeInfo employee_info;
    List<OfficeInfo> office_info;
    private String user_id;
}
