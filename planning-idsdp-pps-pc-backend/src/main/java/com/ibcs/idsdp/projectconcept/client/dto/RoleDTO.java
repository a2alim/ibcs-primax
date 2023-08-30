package com.ibcs.idsdp.projectconcept.client.dto;

import lombok.Data;

@Data
public class RoleDTO {

    private int id;

    private String roleName;

    private String roleDescription;

    private Boolean isRoleDelete;

    private Integer priority;
}
