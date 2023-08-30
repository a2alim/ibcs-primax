package com.ibcs.idsdp.service;

import com.ibcs.idsdp.domain.Permission;
import com.ibcs.idsdp.repositories.NavigationRepo;
import com.ibcs.idsdp.repositories.PermissionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {
    @Autowired
    PermissionRepo permissionRepo;

    public Permission getByPermissionName(String permissionName){
        return permissionRepo.findByPermissionName(permissionName);
    }
}
