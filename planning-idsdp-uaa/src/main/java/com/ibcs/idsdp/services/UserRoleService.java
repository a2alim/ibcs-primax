package com.ibcs.idsdp.services;


import com.ibcs.idsdp.model.domain.Role;
import com.ibcs.idsdp.model.domain.UserRole;
import com.ibcs.idsdp.model.repositories.RoleRepository;
import com.ibcs.idsdp.model.repositories.UserRoleRepository;
import com.ibcs.idsdp.web.dto.request.UserRoleRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserRoleService {

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserService userService;

    /**
     * For finding get Roles By UserId
     * @param userId
     * @return
     */
    public ResponseEntity<List<Role>> getRolesByUserId(Long userId) {
        List<UserRole> userRoles = userRoleRepository.findAllByUserId(userId);
        List<Role> roles = new ArrayList<>();
        for (UserRole userRole : userRoles) {
            Role role = roleRepository.findById(userRole.getRoleId()).get();
            roles.add(role);
        }
        return new ResponseEntity(roles, HttpStatus.OK);
    }

    /**
     * For updating User Role By User
     * @param userId
     * @param userRoleRequest
     */
    @Transactional
    public void updateUserRoleByUser(Long userId, UserRoleRequest userRoleRequest) {
        userRoleRepository.deleteByUserId(userId);
        userService.assignRoleForUser(userId, userRoleRequest);
    }
}
