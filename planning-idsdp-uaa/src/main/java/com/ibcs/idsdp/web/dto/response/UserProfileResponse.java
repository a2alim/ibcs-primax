package com.ibcs.idsdp.web.dto.response;

import lombok.Data;

@Data
public class UserProfileResponse {
    private String name;
    private String presentAddress;
    private String permanentAddress;
    private String mobileNumber;
    private String email;
    private String profileImageUrl;
    private String signatureImageUrl;
    private String designation;
    private String organigationName;
    private String userType;
    private Long userId;
}
