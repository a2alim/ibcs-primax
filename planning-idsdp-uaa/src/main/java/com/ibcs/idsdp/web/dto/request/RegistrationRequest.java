package com.ibcs.idsdp.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegistrationRequest {
    private String name;
    private String emailId;
    private String password;
    private String designation;
    private String mobileNumber;
    private Boolean isActive;
    private String userGroup;
    private String dutyType;
    private Boolean isInstitutional;
    private Boolean isVisitorUser;
}
