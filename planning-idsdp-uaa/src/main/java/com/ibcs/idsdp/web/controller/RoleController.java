package com.ibcs.idsdp.web.controller;


import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.model.domain.Role;
import com.ibcs.idsdp.services.RoleService;
import com.ibcs.idsdp.web.dto.request.RolePermissionsRequest;
import com.ibcs.idsdp.web.dto.request.RoleRequest;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ibcs.idsdp.constants.ApiConstants.*;
import static com.ibcs.idsdp.constants.RoleApiConstants.*;


@ApiController
@AllArgsConstructor
public class RoleController {

    private final RoleService roleService;

    /**
     * For saving RoleRequest
     * @param roleRequest
     * @return
     */
    @PostMapping(value = ROLES_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> create(@RequestBody RoleRequest roleRequest) {
        return roleService.create(roleRequest);
    }

    /**
     * For getting All Roles
     * @return
     */
    @GetMapping(value = ROLES_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<List<Role>> getAllRoles() {
        return roleService.getAllRoles();
    }

    /**
     * For applying Filter
     * @param request
     * @return
     */
    @PostMapping(value = APPLY_FILTER, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<Page<Role>> applyFilter(@RequestBody SearchWithPageableRequest request) {
        return roleService.applyFilter(request);
    }

    /**
     * For get Role List ByPageable
     * @param page
     * @param size
     * @return
     */
    @GetMapping(value = ROLE_PAGEABLE_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
    public Page<Role> getRoleListByPageable(@RequestParam(name = "page", defaultValue = "0") int page,
                                                     @RequestParam(name = "size", defaultValue = "5") int size) {
        return roleService.getRoleListByPageable(page, size);
    }

    /**
     * For getting Role
     * @param RoleId
     * @return
     */
    @GetMapping(value = ROLES_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<Role> getRole(@PathVariable(ID) int RoleId) {
        return roleService.getRoleById(RoleId);
    }

    /**
     * For assigning RolePermission
     * @param rolePermissionsRequest
     * @param roleId
     */
    @PostMapping(value = ROLES_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public void assignRolePermission(@RequestBody RolePermissionsRequest rolePermissionsRequest,
                                     @PathVariable(ID) int roleId) {
        roleService.assignRolePermission(roleId, rolePermissionsRequest);
    }

    /**
     * For deleting Role softDelete
     * @param RoleId
     * @return
     */
    @DeleteMapping(value = ROLES_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> softDelete(@PathVariable(ID) int RoleId) {
        return roleService.softDelete(RoleId);
    }

    /**
     * For editing Role
     * @param RoleId
     * @param roleRequest
     * @return
     */
    @PutMapping(value = ROLES_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> editRole(@PathVariable(ID) int RoleId,
                                           @RequestBody RoleRequest roleRequest) {
        return roleService.editByRoleId(RoleId, roleRequest);
    }
}
