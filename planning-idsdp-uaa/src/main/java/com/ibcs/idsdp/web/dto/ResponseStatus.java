package com.ibcs.idsdp.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseStatus  {
    private Integer status;
    private String message;
}
