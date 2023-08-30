package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.UserRolePermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRolePermissionRepository extends JpaRepository<UserRolePermission, Long> {

    List<UserRolePermission> findAllByUserIdAndRoleIdAndIsActive(Integer userId, Integer roleId, Boolean b);
    UserRolePermission findByUserIdAndRoleIdAndPermissionId(Integer userId, Integer roleId, Integer permissionId);
}
