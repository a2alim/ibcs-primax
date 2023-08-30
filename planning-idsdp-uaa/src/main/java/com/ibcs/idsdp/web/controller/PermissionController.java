package com.ibcs.idsdp.web.controller;


import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.model.domain.Permission;
import com.ibcs.idsdp.services.PermissionService;
import com.ibcs.idsdp.web.dto.request.PermissionRequest;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.ibcs.idsdp.constants.ApiConstants.*;
import static com.ibcs.idsdp.constants.PermissionApiConstants.*;

@ApiController
@AllArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    /**
     * For saving permission
     * @param permissionRequest
     * @return
     */
    @PostMapping(value = PERMISSIONS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<HttpStatus> create(@RequestBody PermissionRequest permissionRequest) {
        return permissionService.create(permissionRequest);
    }

    /**
     * For Getting Permission List
     * @return
     */
    @GetMapping(value = PERMISSIONS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
    public Page<Permission> getAllPermissions(@RequestParam(name = "page", defaultValue = "0") int page,
                                                  @RequestParam(name = "size", defaultValue = "10") int size) {
        return permissionService.getAllPermissions(page, size);
    }

    /**
     * For getting AllPermissions
     * @param page
     * @param size
     * @return
     */
//    @GetMapping(value = PERMISSIONS_PAGEABLE, produces = EXTERNAL_MEDIA_TYPE)
//    public Page<Permission> getAllPermissionsPageable(@RequestParam(name = "page", defaultValue = "0") int page,
//                                                      @RequestParam(name = "size", defaultValue = "5") int size) {
//        return permissionService.getAllPermissionsPageable(page, size);
//    }

    /**
     * For getting Permission
     * @param id
     * @return Permission
     */
    @GetMapping(value = PERMISSION_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<Permission> getPermission(@PathVariable(ID) int id){
        Permission permission =  permissionService.getPermission(id);
        return new ResponseEntity<Permission>(permission, HttpStatus.OK);
    }

    /**
     * For updating Permission
     * @param permission
     * @return
     */
    @PutMapping(value = PERMISSIONS_ENDPOINT, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<HttpStatus> update(@RequestBody PermissionRequest permission) {
        return permissionService.update(permission);
    }

    /**
     * For getting Permissions ByApis
     * @param sobModuleId
     * @return
     */
    @GetMapping(value = PERMISSIONS_WITH_APIS_ENDPOINT + "/{sm_id}", produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<List<Permission>> getPermissionsByApis(@PathVariable("sm_id") Long sobModuleId){
        List<Permission> permissionList = permissionService.getPermissionWithApiEndpointsInSubModule(sobModuleId);
        return new ResponseEntity<List<Permission>>(permissionList, HttpStatus.OK);
    }
}
