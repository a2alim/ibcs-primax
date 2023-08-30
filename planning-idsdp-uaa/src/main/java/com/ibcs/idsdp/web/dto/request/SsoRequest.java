package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

@Data
public class SsoRequest {
    private String userId;
    private String password;
}
