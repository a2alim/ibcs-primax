package com.ibcs.idsdp.common.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseWithResult<d> {
    private Integer status;
    private String message;
    private d res;
}