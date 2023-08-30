package com.ibcs.idsdp.service;

import com.ibcs.idsdp.domain.ApiEndpoints;
import com.ibcs.idsdp.domain.Permission;
import com.ibcs.idsdp.repositories.ApiEndpointsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApiEndpointService {

    @Autowired
    ApiEndpointsRepo apiEndpointsRepo;

    public List<ApiEndpoints> getByPermissionAndMethodType(Permission permission, String type){
        return apiEndpointsRepo.findByPermissionAndMethodType(permission,type);
    }

    public List<ApiEndpoints> getByPermission(Permission permission){
        return apiEndpointsRepo.findByPermission(permission);
    }

}
