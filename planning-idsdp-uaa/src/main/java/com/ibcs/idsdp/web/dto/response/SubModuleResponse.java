package com.ibcs.idsdp.web.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Id;
import java.util.Set;

@Data
@NoArgsConstructor
public class SubModuleResponse {
    @Id
    private Long id;
    private String name;
    //private Map<Permission, RolePermission> permissionRoleMap;
    private Set<PermissionResponse> permissionList;


}
