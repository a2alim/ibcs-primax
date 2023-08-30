package com.ibcs.idsdp.web.dto.response;

import lombok.Data;


@Data
public class AuthUserTokenResponse {
    private String access_token;
    private String token_type;
    private String name;
    private String userName;
    private String expires_in;
}
