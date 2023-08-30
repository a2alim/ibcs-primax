package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.RolePermission;
import com.ibcs.idsdp.model.domain.UserRolePermission;
import com.ibcs.idsdp.model.repositories.RolePermissionRepository;
import com.ibcs.idsdp.model.repositories.UserRolePermissionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class UserRolePermissionService {
    UserRolePermissionRepository userRolePermissionRepository;
    RolePermissionService rolePermissionService;

    public UserRolePermission  getUserRolePermissionByUserAndRoleAndPermission(Integer userId, Integer roleId, Integer permissionId){
       return userRolePermissionRepository.findByUserIdAndRoleIdAndPermissionId(userId, roleId, permissionId);
    }

    public boolean existRolePermission(int roleId, int permissionId){
        RolePermission rolePermission =  rolePermissionService.findByRoleAndPermissionId(roleId,permissionId);
        if(rolePermission!=null)
            return true;
        else
            return false;
    }

    public List<UserRolePermission> getUserRolePermissionByUserAndRole(Integer userId, Integer roleId){
        return userRolePermissionRepository.findAllByUserIdAndRoleIdAndIsActive(userId, roleId, true);
    }

    public void saveAll(List<UserRolePermission> userRolePermissionList) {
        userRolePermissionRepository.saveAll(userRolePermissionList);
    }

    public void safeDeleteAll(List<UserRolePermission> userRolePermissionDeleteList) {
        userRolePermissionRepository.saveAll(userRolePermissionDeleteList);
    }
}
