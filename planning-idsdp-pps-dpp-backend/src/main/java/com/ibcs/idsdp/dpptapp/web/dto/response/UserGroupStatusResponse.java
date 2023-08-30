package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserGroupStatusResponse<d> {
    private Integer status;
    private String message;
    private UserGroupStatus res;
}
