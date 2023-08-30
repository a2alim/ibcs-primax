package com.ibcs.idsdp.model.repositories;


import com.ibcs.idsdp.model.domain.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Integer> {

    List<RolePermission> findAllByRoleId(int roleId);

    RolePermission findByRoleIdAndPermissionId(int roleId, int permissionId);

    List<RolePermission> findAllByRoleIdAndIsActive(int roleId, boolean active);
}
