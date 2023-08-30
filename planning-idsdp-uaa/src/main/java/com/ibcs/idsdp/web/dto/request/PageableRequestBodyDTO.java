package com.ibcs.idsdp.web.dto.request;

import lombok.Data;

@Data
public class PageableRequestBodyDTO {

    private Integer page;
    private Integer size;
}
