package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

@Data
public class DoptorUserRequest {
    private PageableRequestBodyDTO requestBodyDTO;
    private Boolean isActive;
}
