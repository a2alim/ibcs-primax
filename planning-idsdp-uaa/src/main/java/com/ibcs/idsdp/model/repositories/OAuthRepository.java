package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.exceptions.UserNotFoundException;
import com.ibcs.idsdp.model.domain.*;
import com.ibcs.idsdp.web.dto.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Repository;

import java.util.*;


@Repository
@AllArgsConstructor
public class OAuthRepository {

    private JdbcTemplate jdbcTemplate;
    private UserRepository userRepository;
    private UserRoleRepository userRoleRepository;
    private RolePermissionRepository rolePermissionRepository;
    private PermissionRepository permissionRepository;
    private UserRolePermissionRepository userRolePermissionRepository;
    private ApiEndpointsRepository apiEndpointsRepository;

    public UserDto getUserDetails(String emailIdOrMobileNumber) {

        Collection<GrantedAuthority> grantedAuthoritiesList = new ArrayList<>();
        Set<String> componentNames = new HashSet<String>();
        System.out.println("userid = " + emailIdOrMobileNumber);
        User optionalUser = userRepository.findByEmailIdOrMobileNumberAndPhoneIsVerified(emailIdOrMobileNumber,emailIdOrMobileNumber,true);
        if (optionalUser == null) {
            
            /*--------------- Check PPS Desk Officer (Nothi User)----------------*/
            optionalUser = userRepository.findByUserIdAndUserType(emailIdOrMobileNumber, "NOTHI");
            if (optionalUser == null) {
                
                /*--------------- Check RMS Desk Officer (Nothi User)----------------*/
                optionalUser = userRepository.findByUserIdAndUserType(emailIdOrMobileNumber, "Rms_DO");
                if (optionalUser == null) {
                    throw new UserNotFoundException("User not found");
                } else {
                    System.out.println("user found with userid");
                }
            }
        } else {
            System.out.println("user not found with email");
        }
        User user = optionalUser;
        UserDto userDto = new UserDto();
        userDto.setEmailId(emailIdOrMobileNumber);
        userDto.setId(String.valueOf(user.getId()));
        userDto.setName(user.getName());
        userDto.setPassword(user.getPassword());
        userDto.setDesignation(user.getDesignation());
        userDto.setIsActive(user.getIsActive());
        userDto.setIsDelete(user.getIsDelete());
        userDto.setMobileNumber(user.getMobileNumber());
        userDto.setTfa_Enabled(user.getTfa_Enabled());

        List<UserRole> userRoleList = userRoleRepository.findAllByUserId(user.getId());
        for (UserRole userRole : userRoleList) {
            List<RolePermission> rolePermissionList = rolePermissionRepository.findAllByRoleIdAndIsActive(userRole.getRoleId(), true);
            for (RolePermission rolePermission : rolePermissionList) {
                Optional<Permission> optionalPermission = permissionRepository.findById(rolePermission.getPermissionId());
                if (!optionalPermission.isPresent()) {
                    System.err.println("Permission Not Found");
                }
                GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_" + optionalPermission.get().getPermissionName());
                grantedAuthoritiesList.add(grantedAuthority);
                Permission permission = optionalPermission.get();
                List<ApiEndpoints> apiEndpointsList = apiEndpointsRepository.findAllByPermission(permission);
                apiEndpointsList.forEach(apiEndpoint -> {
                    Component component = apiEndpoint.getSubModule().getModule().getComponent();
                    componentNames.add(component.getName());
                });
            }
            List<UserRolePermission> userRolePermissionList = userRolePermissionRepository.findAllByUserIdAndRoleIdAndIsActive(user.getId().intValue(), userRole.getRoleId(), true);
            for (UserRolePermission userRolePermission : userRolePermissionList) {
                Optional<Permission> optionalPermission = permissionRepository.findById(userRolePermission.getPermissionId());
                if (!optionalPermission.isPresent()) {
                    System.err.println("Permission Not Found");
                }
                GrantedAuthority grantedAuthority = new SimpleGrantedAuthority("ROLE_" + optionalPermission.get().getPermissionName());
                grantedAuthoritiesList.add(grantedAuthority);


            }
        }
        userDto.setGrantedAuthoritiesList(grantedAuthoritiesList);
        userDto.setAppAccess(componentNames);
        return userDto;

    }


}
