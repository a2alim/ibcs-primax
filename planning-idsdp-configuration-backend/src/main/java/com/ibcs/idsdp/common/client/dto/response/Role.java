package com.ibcs.idsdp.common.client.dto.response;

import lombok.*;

@Data
public class Role {


    private int id;
    private String roleName;
    private String roleDescription;
    private Boolean isRoleDelete;
    private Integer priority;
}
