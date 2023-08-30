package com.ibcs.idsdp.common.web.dto.request;

import lombok.Data;

@Data
public class PageableRequestBodyDTO implements IRequestBodyDTO {

    private Integer page;
    private Integer size;
}
