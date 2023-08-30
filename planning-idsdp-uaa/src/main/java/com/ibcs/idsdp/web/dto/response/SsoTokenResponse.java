package com.ibcs.idsdp.web.dto.response;

import lombok.Data;

@Data
public class SsoTokenResponse {
    private String access_token;
    private Object user;
}
