package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.*;

import static com.ibcs.idsdp.constants.TableNameConstants.USER_ROLE_PERMISSION_TABLE_NAME;

@Data
@Entity
@Table(name = USER_ROLE_PERMISSION_TABLE_NAME)
public class UserRolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer userId;
    private Integer roleId;
    private Integer permissionId;
    private boolean isActive;
    private boolean isEnable;

}
