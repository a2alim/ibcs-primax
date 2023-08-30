package com.ibcs.idsdp.web.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RoleRequest {

    private String roleName;
    private String description;
    private int priority;

}
