package com.ibcs.idsdp.projectconcept.client.dto;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class UserResponse {

    private Long id;

    private String userId;

    private String name;

    private String emailId;

    private String designation;

    private String mobileNumber;

    private Boolean isActive;

    private List<RoleDTO> roles;

//    private UserGroup userGroupId;
//
//    private UserType dutyTypeId;
}
