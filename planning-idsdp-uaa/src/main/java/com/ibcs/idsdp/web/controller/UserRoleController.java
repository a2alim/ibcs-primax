package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.model.domain.Role;
import com.ibcs.idsdp.services.UserRoleService;
import com.ibcs.idsdp.web.dto.request.UserRoleRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import static com.ibcs.idsdp.constants.ApiConstants.*;
import static com.ibcs.idsdp.constants.UserRoleConstants.USER_ROLE_ENDPOINT;

@ApiController
@AllArgsConstructor
public class UserRoleController {

    @Autowired
    private UserRoleService userRoleService;

    /**
     * For Getting Roles ByUserId
     * @param userId
     * @return
     */
    @GetMapping(value = USER_ROLE_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<List<Role>> getRolesByUserId(@PathVariable(ID) Long userId) {
        return userRoleService.getRolesByUserId(userId);
    }

    /**
     * For updating UserRoleRequest
     * @param userRoleRequest
     * @param userId
     */
    @PutMapping(value = USER_ROLE_ENDPOINT + ID_PATH_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public void updateUserRoleByUser(@RequestBody UserRoleRequest userRoleRequest,
                                                           @PathVariable(ID) Long userId) {
        userRoleService.updateUserRoleByUser(userId, userRoleRequest);
    }
}
