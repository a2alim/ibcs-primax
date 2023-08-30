package com.ibcs.idsdp.web.dto.response;

import lombok.Data;


@Data
public class AuthUserTokenRequest {
    private String userName;
    private String password;
}
