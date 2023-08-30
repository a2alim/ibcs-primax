package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.RolePermission;
import com.ibcs.idsdp.model.repositories.RolePermissionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class RolePermissionService {

    RolePermissionRepository rolePermissionRepository;

    public List<RolePermission> getByRoleId(int roleId) {
        return rolePermissionRepository.findAllByRoleId(roleId);
    }

    public RolePermission findByRoleAndPermissionId(int roleId, int permissionId){
        return rolePermissionRepository.findByRoleIdAndPermissionId(roleId, permissionId);
    }

    public void saveAll(List<RolePermission> rolePermissionList) {
        rolePermissionRepository.saveAll(rolePermissionList);
    }

    public void safeDeleteAll(List<RolePermission> rolePermissionList) {
        rolePermissionRepository.saveAll(rolePermissionList);
    }

    public List<RolePermission> findAllByRoleIdAndActive(int roleId, boolean b) {
        return rolePermissionRepository.findAllByRoleIdAndIsActive(roleId, b);
    }
}
