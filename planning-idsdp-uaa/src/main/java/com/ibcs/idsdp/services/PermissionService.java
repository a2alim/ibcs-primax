package com.ibcs.idsdp.services;


import com.ibcs.idsdp.exceptions.PermissionAlreadyExistException;
import com.ibcs.idsdp.model.domain.Permission;
import com.ibcs.idsdp.model.repositories.PermissionRepository;
import com.ibcs.idsdp.web.dto.request.PermissionRequest;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
@AllArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public ResponseEntity<HttpStatus> create(PermissionRequest permissionRequest) {

        Permission permission = new Permission();
        permission.setPermissionName(permissionRequest.getPermissionName());

        if (isPermissionNameAlreadyExist(permissionRequest.getPermissionName())) {
            throw new PermissionAlreadyExistException("Permission Name Already Exist");
        }

        permissionRepository.save(permission);

        return new ResponseEntity<HttpStatus>(HttpStatus.CREATED);
    }

    private boolean isPermissionNameAlreadyExist(String permissionName) {
        return permissionRepository.existsByPermissionName(permissionName);
    }

        public Page<Permission> getAllPermissions(int page, int size) {
            PageRequest pageRequest = PageRequest.of(page, size);
            Page<Permission> pageResult = permissionRepository.findAll(pageRequest);
            List<Permission> roles = pageResult
                    .stream()
                    .collect(toList());
            return new PageImpl<>(roles, pageRequest, pageResult.getTotalElements());
        }

    public Permission getPermission(int id){
        return permissionRepository.findById(id).get();
    }

    public ResponseEntity<HttpStatus> update(PermissionRequest permissionRequest) {
        Optional<Permission> permissionOptional = permissionRepository.findById(permissionRequest.getId());
        if(!permissionOptional.isEmpty()) {
            Permission permission = permissionOptional.get();
            permission.setPermissionName(permissionRequest.getPermissionName());
            permissionRepository.save(permission);
        }
        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }

    public List<Permission> getPermissionWithApiEndpointsInSubModule(Long subModuleId){
        return permissionRepository.findByPermissionExistInApiEndpoints(subModuleId);
    }
}
