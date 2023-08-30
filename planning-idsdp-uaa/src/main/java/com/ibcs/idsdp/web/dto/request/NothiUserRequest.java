package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

@Data
public class NothiUserRequest {
    private PageableRequestBodyDTO requestBodyDTO;
    private Boolean isActive;
    private String userId;
    private String userType;
    private String password;
}
