package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String name;
    private String mobileNo;
    private String permanentAddress;
    private String presentAddress;
    private String signatureImageUrl;
    private String profileImageUrl;
}
