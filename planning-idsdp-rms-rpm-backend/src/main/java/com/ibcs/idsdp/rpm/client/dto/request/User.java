package com.ibcs.idsdp.rpm.client.dto.request;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String userId;
    private String name;
    private String emailId;
    private String designation;
    private String mobileNumber;
    private Boolean tfa_Enabled;
    private Boolean isActive;
    private Boolean isDelete;
    private String userType;
    private Long userGroupId;
}
