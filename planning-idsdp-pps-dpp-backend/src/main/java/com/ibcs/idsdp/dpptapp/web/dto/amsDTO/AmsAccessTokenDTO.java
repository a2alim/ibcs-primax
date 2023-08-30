package com.ibcs.idsdp.dpptapp.web.dto.amsDTO;

import lombok.Data;


@Data
public class AmsAccessTokenDTO {
    private String client_id;
    private String access_token;
    private String user_name;
    private long expires_in;
}
