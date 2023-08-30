package com.ibcs.idsdp.services;


import com.ibcs.idsdp.exceptions.RoleAlreadyExistException;
import com.ibcs.idsdp.exceptions.RoleNotFoundException;
import com.ibcs.idsdp.model.domain.Permission;
import com.ibcs.idsdp.model.domain.Role;
import com.ibcs.idsdp.model.domain.RolePermission;
import com.ibcs.idsdp.model.repositories.PermissionRepository;
import com.ibcs.idsdp.model.repositories.RolePermissionRepository;
import com.ibcs.idsdp.model.repositories.RoleRepository;
import com.ibcs.idsdp.web.dto.request.RolePermissionsRequest;
import com.ibcs.idsdp.web.dto.request.RoleRequest;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
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
public class RoleService {

    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;

    public ResponseEntity<String> create(RoleRequest roleRequest) {

        Role role = new Role();
        role.setRoleName(roleRequest.getRoleName());
        role.setRoleDescription(roleRequest.getDescription());
        role.setPriority(roleRequest.getPriority());
        role.setIsRoleDelete(false);

        if (isRoleAlreadyExist(roleRequest.getRoleName())) {
            throw new RoleAlreadyExistException("Role Already Present");
        }

        if (roleRequest.getPriority() == 1 && roleRepository.existsByPriority(1))
            throw new RoleAlreadyExistException("Can not create by priority 1");
        roleRepository.save(role);

        return new ResponseEntity("200", HttpStatus.CREATED);
    }

    private boolean isRoleAlreadyExist(String role) {
        return roleRepository.existsByRoleName(role);
    }

    public ResponseEntity<List<Role>> getAllRoles() {
        return new ResponseEntity(roleRepository.findAllByIsNotDelete(), HttpStatus.OK);
    }

    public ResponseEntity<Page<Role>> applyFilter(SearchWithPageableRequest request) {
        return new ResponseEntity(roleRepository.findAllByValue(request.getValue().toLowerCase(), PageRequest.of(request.getPage(), request.getSize())), HttpStatus.OK);
    }

    public Page<Role> getRoleListByPageable(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Role> pageResult = roleRepository.findAllByIsRoleDelete(false, pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    public void assignRolePermission(int roleId, RolePermissionsRequest rolePermissionsRequest) {

        for (String permissionName : rolePermissionsRequest.getPermissionNames()) {
            Optional<Permission> optionalRolePermission = permissionRepository.findAllByPermissionName(permissionName);
            if (!optionalRolePermission.isPresent()) {
                System.err.println(permissionName + " not found");
            } else {
                RolePermission rolePermission = new RolePermission();
                rolePermission.setRoleId(roleId);
                rolePermission.setPermissionId(optionalRolePermission.get().getId());
                rolePermissionRepository.save(rolePermission);
            }
        }
    }

    public ResponseEntity<Role> getRoleById(Integer roleId) {
        Optional<Role> optionalRole = roleRepository.findById(roleId);
        if (!optionalRole.isPresent()) {
            throw new RoleNotFoundException("Role not found");
        }
        return new ResponseEntity(optionalRole.get(), HttpStatus.OK);
    }

    public ResponseEntity<String> softDelete(int roleId) {

        Optional<Role> optionalRole = roleRepository.findById(roleId);

        if (!optionalRole.isPresent()) {
            throw new RoleNotFoundException("Role Not Found");
        }
        Role role = optionalRole.get();
        role.setIsRoleDelete(true);

        roleRepository.save(role);

        return new ResponseEntity("200", HttpStatus.OK);
    }

    public ResponseEntity<String> editByRoleId(int roleId, RoleRequest roleRequest) {
        Optional<Role> optionalRole = roleRepository.findById(roleId);
        if (!optionalRole.isPresent()) {
            throw new RoleNotFoundException("Role Not Found");
        }

        if (roleRequest.getPriority() == 1 && roleRepository.existsByPriority(1))
            throw new RoleAlreadyExistException("Can not update by priority 1");

        Role role = optionalRole.get();
        role.setRoleName(roleRequest.getRoleName());
        role.setRoleDescription(roleRequest.getDescription());
        role.setPriority(roleRequest.getPriority());
        roleRepository.save(role);
        return new ResponseEntity("200", HttpStatus.OK);
    }
}
