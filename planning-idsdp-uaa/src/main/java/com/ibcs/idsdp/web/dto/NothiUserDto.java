package com.ibcs.idsdp.web.dto;

import lombok.Data;

@Data
public class NothiUserDto {
    private Long id;
    private String nothiId;
    private String name;
    private String designation;
    private String section;
    private String mobileNumber;
    private String email;
    private Boolean isActive;
    private String ministry;
}
