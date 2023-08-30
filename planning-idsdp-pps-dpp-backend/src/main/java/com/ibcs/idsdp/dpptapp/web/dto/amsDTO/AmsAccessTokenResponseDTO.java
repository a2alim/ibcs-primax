package com.ibcs.idsdp.dpptapp.web.dto.amsDTO;

import lombok.Data;


@Data
public class AmsAccessTokenResponseDTO {
    private int response_code;
    private AmsAccessTokenDTO data;
}
