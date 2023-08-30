package com.ibcs.idsdp.model.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

import static com.ibcs.idsdp.constants.TableNameConstants.ROLE_PERMISSION_TABLE_NAME;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = ROLE_PERMISSION_TABLE_NAME)

public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @Column(name = "PERMISSION_ID")
    private int permissionId;

    @Column(name = "ROLE_ID")
    private int roleId;

    @Column(name = "is_active")
    private boolean isActive;

}
